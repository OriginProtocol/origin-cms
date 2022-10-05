'use strict';

/**
 * ousd-faq router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::ousd.ousd-faq', {
  only: ['find', 'findOne'],
});
