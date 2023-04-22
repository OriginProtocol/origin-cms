'use strict';

/**
 * oeth-audit service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::oeth.oeth-audit');
