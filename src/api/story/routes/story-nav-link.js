'use strict';

/**
 * story-nav-link router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::story.story-nav-link', {
  only: ['find', 'findOne'],
});
