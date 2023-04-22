'use strict';

/**
 * oeth-audit router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::oeth.oeth-audit', {
  only: ['find', 'findOne'],
});
