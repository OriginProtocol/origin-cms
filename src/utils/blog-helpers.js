'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { pick } = require('lodash');

const ALL_SITES = {
  OriginProtocol: 'website',
  OUSD: 'ousd',
  Story: 'story',
};

// Valid site values: website, story, ousd
const siteIDToPostSchemaID = (siteID) => `api::blog.${siteID}-post`;

function generateBlogController(siteID) {
  const schemaID = siteIDToPostSchemaID(siteID);

  return createCoreController(schemaID, ({ strapi }) => ({
    async findAll(ctx) {
      const { locale } = ctx.params;
      const { query } = ctx;

      query.filters = {
        ...query.filters,
        locale: 'en',
      };

      query.populate = {
        ...query.populate,
        category: {
          fields: ['name', 'slug', 'description'],
        },
        author: {
          populate: ['avatar'],
        },
      };

      const hasLocaleFilter = locale && locale !== 'en';

      if (hasLocaleFilter) {
        // When using a different locale, include
        // translated content if it exists
        query.populate.localizations = {
          filters: {
            locale,
          },
          populate: {
            category: {
              fields: ['name', 'slug', 'description'],
            },
            author: {
              populate: ['avatar'],
            },
          },
        };
      }

      const queryResults = await strapi.service(schemaID).find(query);

      const { pagination } = queryResults;

      let results = queryResults.results;

      if (hasLocaleFilter) {
        results = results.map((r) => (r.localizations?.length ? r.localizations[0] : r));
      }

      return {
        data: sanitizePost(results),
        meta: { pagination },
      };
    },

    async findBySlug(ctx) {
      const { slug, locale } = ctx.params;
      const { query } = ctx;

      query.filters = {
        ...query.filters,
        slug,
        locale: {
          $in: [locale, 'en'].filter((x) => x),
        },
      };

      query.populate = {
        ...query.populate,
        category: {
          fields: ['name', 'slug', 'description'],
        },
        author: {
          populate: ['avatar'],
        },
      };

      const { results } = await strapi.service(schemaID).find(query);

      const content = results.find((r) => r.locale === locale) || results[0];

      return this.transformResponse(sanitizePost(content));
    },

    async slugs() {
      const { results } = await strapi.service(schemaID).find({
        fields: ['slug', 'updatedAt'],
      });

      return {
        // Restructure the data to make it lesser size
        data: results.map((post) => [new Date(post.updatedAt).getTime(), post.slug]),
      };
    },

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
              locale: locale,
            },
          },
        };
      }

      const queryResults = await strapi.service('api::blog.category').find(query);

      let results = queryResults.results;

      if (hasLocaleFilter) {
        results = results.map((r) => (r.localizations?.length ? r.localizations[0] : r));
      }

      return { data: sanitzeCategory(results) };
    },
  }));
}

function generateBlogRouter(siteID) {
  return {
    routes: [
      {
        // Get all post slugs
        method: 'GET',
        config: {
          auth: false,
        },
        path: `/blog/${siteID}/slugs`,
        handler: `${siteID}-post.slugs`,
      },
      {
        // Get all categories
        method: 'GET',
        config: {
          auth: false,
        },
        path: `/blog/${siteID}/:locale?/categories`,
        handler: `${siteID}-post.categories`,
      },
      {
        // Get all posts
        method: 'GET',
        config: {
          auth: false,
        },
        path: `/blog/${siteID}/:locale?`,
        handler: `${siteID}-post.findAll`,
      },
      {
        // Find a single post by slug
        method: 'GET',
        config: {
          auth: false,
        },
        path: `/blog/${siteID}/:locale/:slug`,
        handler: `${siteID}-post.findBySlug`,
      },
    ],
  };
}

function sanitizePost(post) {
  if (Array.isArray(post)) {
    return post.map((p) => sanitizePost(p));
  }

  return {
    ...pick(post, ['title', 'body', 'slug', 'locale', 'publishedAt', 'updatedAt']),
    category: sanitzeCategory(post.category),
    author: sanitzeAuthor(post.author),
  };
}

function sanitzeCategory(cat) {
  if (Array.isArray(cat)) {
    return cat.map((c) => sanitizePost(c));
  }

  return pick(cat, ['name', 'slug', 'description']);
}

function sanitzeAuthor(author) {
  if (Array.isArray(author)) {
    return author.map((a) => sanitizePost(a));
  }

  return pick(author, ['name', 'avatar', 'bio']);
}

module.exports = {
  ALL_SITES,

  generateBlogController,
  generateBlogRouter,
};
