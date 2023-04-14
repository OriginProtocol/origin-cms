'use strict';

/**
 * oeth-partner router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::oeth.oeth-partner', {
  only: ['find', 'findOne'],
});
