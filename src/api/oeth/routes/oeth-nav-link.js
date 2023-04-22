'use strict';

/**
 * oeth-nav-link router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::oeth.oeth-nav-link', {
  only: ['find', 'findOne'],
});
