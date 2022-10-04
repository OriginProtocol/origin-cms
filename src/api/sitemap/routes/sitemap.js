module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/sitemap/:site',
      handler: 'sitemap.getSiteUrls',
      config: {
        auth: false,
        policies: [],
        middlewares: [
          (ctx, next) => {
            if (!['story', 'ousd', 'website'].includes(ctx.params.site)) {
              ctx.throw(404, 'Invalid site')
            }

            return next()
          }
        ],
      },
    },
  ],
};
