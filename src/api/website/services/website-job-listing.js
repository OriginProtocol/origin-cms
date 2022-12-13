'use strict';

/**
 * website-job-listing service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::website.website-job-listing');
