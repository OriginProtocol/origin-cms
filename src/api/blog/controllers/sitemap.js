const { ALL_SITES } = require('../../../utils/_helpers');

class SitemapController {
  constructor(strapi) {
    this.strapi = strapi;
    this.service = this.strapi.service('api::blog.sitemap');
  }

  async get(ctx) {
    const { siteID } = ctx.params;

    if (!Object.values(ALL_SITES).includes(siteID)) {
      return ctx.notFound('Not found');
    }

    const sitemapContent = await this.service.get(siteID);

    ctx.response.set('Content-Type', 'application/xml');

    return sitemapContent;
  }
}

module.exports = ({ strapi }) => new SitemapController(strapi);
