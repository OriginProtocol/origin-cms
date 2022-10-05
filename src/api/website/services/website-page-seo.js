'use strict';

/**
 * page-seo service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::website.website-page-seo');
