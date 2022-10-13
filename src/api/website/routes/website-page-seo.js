'use strict';

const { validateLocaleMiddleware } = require('../../../utils/localization');

module.exports = {
  routes: [
    {
      // Get a page by locale
      method: 'GET',
      path: '/website/page/:locale/:path',
      handler: 'website-page-seo.find',
      config: {
        auth: {
          scope: ['find'],
        },
        middlewares: [validateLocaleMiddleware],
      },
    },
  ],
};
