'use strict';

/**
 * category router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::blog.category', {
  only: ['find', 'findOne']
});
