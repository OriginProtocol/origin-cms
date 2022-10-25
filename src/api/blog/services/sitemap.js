const { debounce } = require('lodash');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

const { ALL_SITES, SITE_HOSTS } = require('../../../utils/_helpers');

const DEBOUNCE_INTERVAL = 5 * 60 * 1000; // 5m

class SitemapService {
  constructor(strapi) {
    this.strapi = strapi;

    // TODO: Use redis instead of in-memory cache
    this.sitemaps = {};

    for (const siteID of Object.values(ALL_SITES)) {
      this._subscribe(siteID);
      this.sitemaps[siteID] = {
        loaded: false,
        // Initial sitemap generation
        loadPromise: this.regenerate(siteID),
      };
    }
  }

  _subscribe(siteID) {
    // Debounce regeneration with 5m interval
    const regenerateForSite = debounce(() => {
      this.regenerate(siteID);
    }, DEBOUNCE_INTERVAL);

    // Subscribe to lifecycle hooks
    this.strapi.db.lifecycles.subscribe({
      models: [
        'i18n.locales',
        'api::blog.category',
        `api::blog.${siteID}-post`,
        `api::${siteID}.${siteID}-page-seo`,
      ],

      // TODO: Update only changed items instead of regenerating everytime
      afterCreate: regenerateForSite,
      afterCreateMany: regenerateForSite,
      afterUpdate: regenerateForSite,
      afterUpdateMany: regenerateForSite,
      afterDelete: regenerateForSite,
      afterDeleteMany: regenerateForSite,
    });
  }

  async get(siteID) {
    const { loaded, loadPromise } = this.sitemaps[siteID];

    if (!loaded) {
      await loadPromise;
    }

    return this.sitemaps[siteID].content || '';
  }

  async getSlugs(siteID) {
    const { loaded, loadPromise } = this.sitemaps[siteID];

    if (!loaded) {
      await loadPromise;
    }

    return this.sitemaps[siteID].postSlugs || [];
  }

  async regenerate(siteID) {
    const siteHost = SITE_HOSTS[siteID];
    const links = [];

    links.push({
      url: '/',
    });

    // Get all locales
    const localeResults = await this.strapi.db.query('plugin::i18n.locale').findMany({
      select: ['code'],
    });
    const locales = localeResults.map((l) => l.code);

    // Get static pages
    const pageSchemaId = `api::${siteID}.${siteID}-page-seo`;
    const pages = await this.strapi.db.query(pageSchemaId).findMany({
      select: ['page'],
      where: { 
        locale: 'en',
        published_at: {
          $lte: Date.now()
        }
      },
    });

    // Append all static pages to the sitemap
    for (const locale of locales) {
      for (const { page } of pages) {
        links.push({
          url: `/${locale}${page}`,
        });
      }
    }

    // Get blog posts
    const postSchemaId = `api::blog.${siteID}-post`;
    const posts = await this.strapi.db.query(postSchemaId).findMany({
      select: ['slug', 'updatedAt'],
      where: { 
        locale: 'en',
        published_at: {
          $lte: Date.now()
        }
      },
    });

    // Append all blog posts to the sitemap
    for (const locale of locales) {
      for (const { slug, updatedAt } of posts) {
        links.push({
          url: `/${locale}/${slug}`,
          lastmod: updatedAt,
        });
      }
    }

    // Create a sitemap
    const stream = new SitemapStream({
      hostname: siteHost,
    });
    const data = await streamToPromise(Readable.from(links).pipe(stream));
    const xmlContent = data.toString();

    // Cache it in memory
    this.sitemaps[siteID] = {
      loaded: true,
      postSlugs: posts.map((p) => p.slug),
      content: xmlContent,
    };

    return xmlContent;
  }
}

module.exports = ({ strapi }) => new SitemapService(strapi);
