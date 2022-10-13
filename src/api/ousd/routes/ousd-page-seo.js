'use strict';

const { validateLocaleMiddleware } = require('../../../utils/localization');

module.exports = {
  routes: [
    {
      // Get a page by locale
      method: 'GET',
      path: '/ousd/page/:locale/:path',
      handler: 'ousd-page-seo.find',
      config: {
        auth: {
          scope: ['find'],
        },
        middlewares: [validateLocaleMiddleware],
      },
    },
  ],
};
