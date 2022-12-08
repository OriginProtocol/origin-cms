'use strict';

/**
 * ousd-partner router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::ousd.ousd-partner', {
  only: ['find', 'findOne'],
});
