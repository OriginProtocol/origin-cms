'use strict';

/**
 * ousd-audit service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::ousd.ousd-audit');
