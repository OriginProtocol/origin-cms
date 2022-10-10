'use strict';

const { ALL_SITES } = require('./_helpers')
const { sanitizePost, sanitizeCategory } = require('./sanitize')
const { getLocalizedPost, getLocalizedContent, validateLocaleMiddleware } = require('./localization')

// Valid site values: website, story, ousd
const siteIDToPostSchemaID = (siteID) => `api::blog.${siteID}-post`;

class BlogController {
  constructor(siteID, strapi) {
    this.siteID = siteID
    this.schemaID = siteIDToPostSchemaID(siteID)
    this.strapi = strapi
  }

  getPostService() {
    return this.strapi.service(this.schemaID)
  }

  getCategoryService() {
    return this.strapi.service('api::blog.category')
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

    const localizationFilter = (!locale || locale === 'en') ? {} : {
      localizations: {
        filters: {
          locale: locale,
        },
      },
    };

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

    if (slug && !data?.[0]) {
      ctx.response.notFound()
      return 
    }

    return {
      // Return object for single post queries; array otherwise.
      data: slug ? data[0] : data,
      meta: slug ? {} : { pagination },
    };
  }

  async slugs() {
    const { results } = await this.getPostService().find({
      fields: ['slug', 'updatedAt'],
    });

    return {
      // Restructure the data to make it lesser size
      data: results.map((post) => [new Date(post.updatedAt).getTime(), post.slug]),
    };
  }

  async categories(ctx) {
    const { locale } = ctx.params;
    const hasLocaleFilter = locale && locale !== 'en';

    const query = {
      filters: {
        locale: 'en',
      },
    };

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

    return { data: sanitizeCategory(getLocalizedContent(results)) };
  }
}

function generateBlogController(siteID) {
  return ({ strapi }) => new BlogController(siteID, strapi)
}

function generateBlogRouter(siteID) {
  return {
    routes: [
      {
        // Get all post slugs
        method: 'GET',
        path: `/blog/${siteID}/slugs`,
        handler: `${siteID}-post.slugs`, 
      },
      {
        // Get all categories
        method: 'GET',
        path: `/blog/${siteID}/:locale/categories`,
        handler: `${siteID}-post.categories`,
        config: {
          middlewares: [validateLocaleMiddleware]
        }
      },
      {
        // Find a single post by slug
        method: 'GET',
        path: `/blog/${siteID}/:locale/:slug`,
        handler: `${siteID}-post.find`,
        config: {
          middlewares: [validateLocaleMiddleware]
        }
      },
      {
        // Get all posts by locale
        method: 'GET',
        path: `/blog/${siteID}/:locale`,
        handler: `${siteID}-post.find`,
        config: {
          middlewares: [validateLocaleMiddleware]
        }
      },
      {
        // Get all posts
        method: 'GET',
        path: `/blog/${siteID}`,
        handler: `${siteID}-post.find`,
      },
    ],
  };
}

module.exports = {
  ALL_SITES,

  generateBlogController,
  generateBlogRouter,
};
