'use strict';

module.exports = {
  getSiteUrls: async (ctx, next) => {
    try {
      const { site } = ctx.params
      const service = strapi.service(`api::sitemap.${site}`)

      ctx.send({
        urls: await service.getUrls()
      })
    } catch (err) {
      ctx.body = err;
    }
  }
};
