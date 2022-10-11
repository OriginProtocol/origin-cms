'use strict';

/**
 * story-drop router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::story.story-drop', {
  only: ['find', 'findOne'],
});
