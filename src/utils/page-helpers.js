'use strict';

const { getLocalizedContent } = require('./localization');
const { sanitizePage } = require('./sanitize');

class PageController {
  constructor(siteID, strapi) {
    this.siteID = siteID;
    this.schemaID = `api::${siteID}.${siteID}-page-seo`;
    this.strapi = strapi;
  }

  getService() {
    return this.strapi.service(this.schemaID);
  }

  async find(ctx) {
    const { locale, path } = ctx.params;

    const { results } = await this.getService().find({
      filters: {
        page: decodeURIComponent(path),
        locale: 'en',
      },
      populate: {
        metaTags: {},
        localizations: {
          filters: {
            locale,
          },
        },
      },
    });

    if (!results.length) {
      ctx.response.notFound('Not found');
      return;
    }

    return {
      data: sanitizePage(getLocalizedContent(results[0])),
    };
  }
}

module.exports = {
  PageController,
};
