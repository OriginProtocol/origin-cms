'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

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
      const { query } = ctx;

      query.populate = {
        ...query.populate,
        category: {
          fields: ['name', 'slug', 'description'],
        },
        author: {
          // fields: ['name', 'avatar', 'bio']
        },
      };

      const { results, pagination } = await strapi.service(schemaID).find(query);
      // TODO: write custom sanitizer
      // const sanitizedResults = await this.sanitizeOutput(results, ctx);

      return this.transformResponse(results, { pagination });
    },

    async findBySlug(ctx) {
      const { slug } = ctx.params;
      const { query } = ctx;

      query.filters = {
        ...query.filters,
        slug,
      };

      query.populate = {
        ...query.populate,
        category: {
          fields: ['name', 'slug', 'description'],
        },
        author: {
          // fields: ['name', 'avatar', 'bio']
        },
      };

      const { results } = await strapi.service(schemaID).find(query);
      // TODO: write custom sanitizer
      // const sanitizedEntity = await this.sanitizeOutput(results[0], ctx);

      return this.transformResponse(results[0]);
    },

    async slugs() {
      const { results } = await strapi.service(schemaID).find({
        fields: ['slug', 'updatedAt', 'locale'],
        populate: {
          category: {
            fields: ['slug'],
          },
        },
      });

      return {
        // Restructure the data to make it lesser size
        data: results.map((post) => [
          post.locale,
          new Date(post.updatedAt).getTime(),
          post.category?.slug,
          post.slug,
        ]),
      };
    },
  }));
}

function generateBlogRouter(siteID) {
  return {
    routes: [
      {
        // Get all posts
        method: 'GET',
        config: {
          auth: false,
        },
        path: `/blog/${siteID}`,
        handler: `${siteID}-post.findAll`,
      },
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
        // Find a single post by slug
        method: 'GET',
        config: {
          auth: false,
        },
        path: `/blog/${siteID}/:slug`,
        handler: `${siteID}-post.findBySlug`,
      },
    ],
  };
}

module.exports = {
  ALL_SITES,

  generateBlogController,
  generateBlogRouter,
};
