'use strict';

const { validateLocaleMiddleware } = require('../../../utils/localization');

module.exports = {
  routes: [
    {
      // Get all team members
      method: 'GET',
      path: '/website/team/:locale',
      handler: 'website-team-member.get',
      config: {
        auth: {
          scope: ['find'],
        },
        middlewares: [validateLocaleMiddleware],
      },
    },
  ],
};
