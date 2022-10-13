'use strict';

const { validateLocaleMiddleware } = require('../../../utils/localization');

module.exports = {
  routes: [
    {
      // Get a page by locale
      method: 'GET',
      path: '/story/page/:locale/:path',
      handler: 'story-page-seo.find',
      config: {
        auth: {
          scope: ['find'],
        },
        middlewares: [validateLocaleMiddleware],
      },
    },
  ],
};
