'use strict';

/**
 * sitemap service
 */

module.exports = () => ({
  async getUrls() {
    console.log(await strapi.query('api::blog.website-post').findMany())
    return {
      '/URL1': Date.now()
    }
  }
});
