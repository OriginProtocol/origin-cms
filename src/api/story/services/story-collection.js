'use strict';

/**
 * story-collection service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::story.story-collection');
