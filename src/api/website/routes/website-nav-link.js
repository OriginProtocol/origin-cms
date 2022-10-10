'use strict';

/**
 * website-nav-link router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::website.website-nav-link', {
  only: ['find', 'findOne'],
});
