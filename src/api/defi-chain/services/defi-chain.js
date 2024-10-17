'use strict';

/**
 * defi-chain service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::defi-chain.defi-chain');
