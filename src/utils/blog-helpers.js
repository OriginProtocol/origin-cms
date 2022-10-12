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
    this.strapi = strapi;
  }

  getPostService() {
    return this.strapi.service(this.schemaID);
  }

  getCategoryService() {
    return this.strapi.service('api::blog.category');
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

    if (slug && !data?.[0]) {
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
    const { results } = await this.getPostService().find({
      fields: ['slug', 'updatedAt'],
    });

    return {
      // Restructure the data to make it lesser size
      data: results.map((post) => [new Date(post.updatedAt).getTime(), post.slug]),
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
      ...ctx,
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

    return ctx.notFound('Not found');
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
          middlewares: [validateLocaleMiddleware],
        },
      },
      {
        // Get all categories
        method: 'GET',
        path: `/${siteID}/blog/:locale/categories`,
        handler: `${siteID}-post.categories`,
        config: {
          middlewares: [validateLocaleMiddleware],
        },
      },
      {
        // Find a single post by slug
        method: 'GET',
        path: `/${siteID}/blog/:locale/:slug`,
        handler: `${siteID}-post.find`,
        config: {
          middlewares: [validateLocaleMiddleware],
        },
      },
      {
        // Get all posts by locale
        method: 'GET',
        path: `/${siteID}/blog/:locale`,
        handler: `${siteID}-post.find`,
        config: {
          middlewares: [validateLocaleMiddleware],
        },
      },
      {
        // Get all posts
        method: 'GET',
        path: `/${siteID}/blog`,
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
