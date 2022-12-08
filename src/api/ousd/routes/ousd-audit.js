'use strict';

/**
 * ousd-audit router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::ousd.ousd-audit', {
  only: ['find', 'findOne'],
});
