'use strict';

const { ALL_SITES } = require('./_helpers');
const { sanitizePost, sanitizeCategory } = require('./sanitize');
const {
  getLocalizedPost,
  getLocalizedContent,
  validateLocaleMiddleware,
} = require('./localization');

class BlogController {
  constructor(siteID, strapi) {
    this.siteID = siteID;
    this.schemaID = `api::blog.${siteID}-post`;
    this.pageSchemaID = `api::${siteID}.${siteID}-page-seo`;
    this.strapi = strapi;
  }

  getPostService() {
    return this.strapi.service(this.schemaID);
  }

  getPageService() {
    return this.strapi.service(this.pageSchemaID);
  }

  getCategoryService() {
    return this.strapi.service('api::blog.category');
  }

  getSitemapService() {
    return this.strapi.service('api::blog.sitemap');
  }

  async find(ctx) {
    const { locale, slug } = ctx.params;
    const { query } = ctx;

    query.filters = {
      ...query.filters,
      locale: 'en',
    };

    if (slug) {
      // For single post query
      query.filters.slug = slug;
    }

    let localizationFilter = {};
    if (locale && locale !== 'en') {
      localizationFilter = {
        localizations: {
          filters: {
            locale,
          },
        },
      };
    }

    query.populate = {
      ...query.populate,
      // Include cover pic
      cover: true,
      category: {
        populate: {
          // Category localization
          ...localizationFilter,
        },
      },
      author: {
        populate: {
          // Include post avatar
          avatar: true,
          // Author localization
          ...localizationFilter,
        },
      },
      // Post localization
      ...localizationFilter,
    };

    const { results, pagination } = await this.getPostService().find(query);

    const data = sanitizePost(getLocalizedPost(results));

    if (slug && !data?.[0] && ctx.response) {
      ctx.response.notFound();
      return;
    }

    return {
      // Return object for single post queries; array otherwise.
      data: slug ? data[0] : data,
      meta: slug ? {} : { pagination },
    };
  }

  async slugs() {
    const data = await this.getSitemapService().getSlugs(this.siteID);

    return {
      data,
    };
  }

  async categories(ctx) {
    const { locale, slug } = ctx.params;
    const hasLocaleFilter = locale && locale !== 'en';

    const query = {
      filters: {
        locale: 'en',
      },
    };

    if (slug) {
      query.filters.slug = slug;
    }

    if (hasLocaleFilter) {
      query.populate = {
        localizations: {
          filters: {
            locale: locale || 'en',
          },
        },
      };
    }

    const { results } = await this.getCategoryService().find(query);

    return { data: sanitizeCategory(getLocalizedContent(slug ? results[0] : results)) };
  }

  async resolve(ctx) {
    const { uuid, locale } = ctx.params;

    // Check if uuid is that of a category
    const { data: category } = await this.categories({
      params: {
        slug: uuid,
        locale,
      },
    });

    if (category) {
      return {
        schema: 'category',
        data: category,
      };
    }

    // Check if uuid is that of a post
    const { data: post } = await this.find({
      query: {},
      params: {
        slug: uuid,
        locale,
      },
    });

    if (post) {
      return {
        schema: 'post',
        data: post,
      };
    }

    return ctx.response.notFound('Not found');
  }
}

function generateBlogController(siteID) {
  return ({ strapi }) => new BlogController(siteID, strapi);
}

function generateBlogRouter(siteID) {
  return {
    routes: [
      {
        // Get route data
        method: 'GET',
        path: `/${siteID}/resolve/:locale/:uuid`,
        handler: `${siteID}-post.resolve`,
        config: {
          auth: {
            scope: ['find'],
          },
          middlewares: [validateLocaleMiddleware],
        },
      },
      {
        // Get all post slugs
        method: 'GET',
        path: `/${siteID}/blog/slugs`,
        handler: `${siteID}-post.slugs`,
        config: {
          auth: {
            scope: ['find'],
          },
        },
      },
      {
        // Get all categories
        method: 'GET',
        path: `/${siteID}/blog/:locale/categories`,
        handler: `${siteID}-post.categories`,
        config: {
          auth: {
            scope: ['find'],
          },
          middlewares: [validateLocaleMiddleware],
        },
      },
      {
        // Find a single post by slug
        method: 'GET',
        path: `/${siteID}/blog/:locale/:slug`,
        handler: `${siteID}-post.find`,
        config: {
          auth: {
            scope: ['find'],
          },
          middlewares: [validateLocaleMiddleware],
        },
      },
      {
        // Get all posts by locale
        method: 'GET',
        path: `/${siteID}/blog/:locale`,
        handler: `${siteID}-post.find`,
        config: {
          auth: {
            scope: ['find'],
          },
          middlewares: [validateLocaleMiddleware],
        },
      },
      {
        // Get all posts
        method: 'GET',
        path: `/${siteID}/blog`,
        handler: `${siteID}-post.find`,
        config: {
          auth: {
            scope: ['find'],
          },
        },
      },
    ],
  };
}

module.exports = {
  ALL_SITES,

  generateBlogController,
  generateBlogRouter,
};
