'use strict';

/**
 * oeth-faq router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::oeth.oeth-faq', {
  only: ['find', 'findOne'],
});
