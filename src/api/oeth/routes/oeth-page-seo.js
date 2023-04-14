'use strict';

const { validateLocaleMiddleware } = require('../../../utils/localization');

module.exports = {
  routes: [
    {
      // Get a page by locale
      method: 'GET',
      path: '/oeth/page/:locale/:path',
      handler: 'oeth-page-seo.find',
      config: {
        auth: {
          scope: ['find'],
        },
        middlewares: [validateLocaleMiddleware],
      },
    },
  ],
};
