module.exports = {
  routes: [
    {
      path: '/:siteID/sitemap',
      method: 'GET',
      handler: 'sitemap.get',
      config: {
        auth: false,
      },
    },
  ],
};
