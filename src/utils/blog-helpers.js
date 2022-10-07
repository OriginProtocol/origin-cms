'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { pick, omit } = require('lodash');

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

      const localizationFilter = {
        localizations: {
          filters: {
            locale: locale || 'en',
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

      const { results, pagination } = await strapi.service(schemaID).find(query);

      const data = sanitizePost(getLocalizedPost(results));

      return {
        // Return object for single post queries; array otherwise.
        data: slug ? data[0] : data,
        meta: slug ? {} : { pagination },
      };
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
              locale: locale || 'en',
            },
          },
        };
      }

      const { results } = await strapi.service('api::blog.category').find(query);

      return { data: sanitzeCategory(getLocalizedContent(results)) };
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
        handler: `${siteID}-post.find`,
      },
      {
        // Find a single post by slug
        method: 'GET',
        config: {
          auth: false,
        },
        path: `/blog/${siteID}/:locale/:slug`,
        handler: `${siteID}-post.find`,
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
    cover: sanitizeMedia(post.cover),
    category: sanitzeCategory(post.category),
    author: sanitzeAuthor(post.author),
  };
}

function sanitzeCategory(cat) {
  if (Array.isArray(cat)) {
    return cat.map((c) => sanitzeCategory(c));
  }

  return pick(cat, ['name', 'slug', 'description']);
}

function sanitzeAuthor(author) {
  if (Array.isArray(author)) {
    return author.map((a) => sanitzeAuthor(a));
  }

  return {
    ...pick(author, ['name', 'bio']),
    avatar: sanitizeMedia(author.avatar),
  };
}

function sanitizeMedia(media) {
  return pick(media, [
    'url',
    'previewUrl',
    'width',
    'height',
    'caption',
    'alternativeText',
    'formats',
    'mime',
    'size',
    'ext',
  ]);
}

function getLocalizedContent(obj) {
  if (Array.isArray(obj)) {
    return obj.map((o) => getLocalizedContent(o));
  }

  if (obj?.localizations && obj.localizations.length) {
    return {
      ...omit(obj, 'localizations'),
      ...obj.localizations[0],
    };
  }

  return omit(obj, 'localizations');
}

function getLocalizedPost(post) {
  if (Array.isArray(post)) {
    return post.map((p) => getLocalizedPost(p));
  }

  const localizedPost = getLocalizedContent(post);

  return {
    ...localizedPost,
    author: getLocalizedContent(post.author),
    category: getLocalizedContent(post.category),
  };
}

module.exports = {
  ALL_SITES,

  generateBlogController,
  generateBlogRouter,
};
