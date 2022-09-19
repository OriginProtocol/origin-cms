'use strict';

/**
 * story-drop service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::story-drop.story-drop');
