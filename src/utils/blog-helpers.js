'use strict';

/**
 *  article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const ALL_SITES = {
  OriginProtocol: 'website',
  OUSD: 'ousd',
  Story: 'story'
}

// Valid site values: website, story, ousd
const siteIDToPostSchemaID = (siteID) => `api::blog.${siteID}-post`

function generateBlogController(siteID) {
  const schemaID = siteIDToPostSchemaID(siteID)

  return createCoreController(schemaID, ({ strapi }) => ({

    async findOne(ctx) {
      const { slug } = ctx.params;
      const { query } = ctx;
  
      if (!query.filters) query.filters = {}
      query.filters.slug = slug
  
      const { results } = await strapi.service(schemaID).find(query);
      const sanitizedEntity = await this.sanitizeOutput(results[0], ctx);
  
      return this.transformResponse(sanitizedEntity);
    },

    async slugs() {
      const { results } = await strapi.service(schemaID).find({
        fields: ['slug', 'updatedAt', 'locale']
      });

      return {
        // Restructure the data to make it lesser size
        data: results.map(post => [post.locale, new Date(post.updatedAt).getTime(), post.slug])
      }
    }
  }));
};

function generateBlogRouter(siteID) {
  return {
    routes: [
      {
        // Get all posts
        method: 'GET',
        path: `/blog/${siteID}`,
        handler: `${siteID}-post.find`,
        config: {
          auth: false
        }
      },
      {
        // Get all post slugs
        method: 'GET',
        path: `/blog/${siteID}/slugs`,
        handler: `${siteID}-post.slugs`,
        config: {
          auth: false
        }
      },
      {
        // Find a single post by slug
        method: 'GET',
        path: `/blog/${siteID}/:slug`,
        handler: `${siteID}-post.findOne`,
        config: {
          auth: false
        }
      },
    ]
  }
}

module.exports = { 
  ALL_SITES,

  generateBlogController,
  generateBlogRouter
}
