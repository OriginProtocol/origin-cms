'use strict';

/**
 * story-page-seo router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::story.story-page-seo', {
  only: ['find', 'findOne'],
});
