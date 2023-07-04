'use strict';

/**
 * oeth-partner controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::oeth.oeth-partner', () => ({
    async find(ctx) {
      ctx.query = { ...ctx.query, sort: { rank: 'asc' } }
      const { data } = await super.find(ctx);
      return { data };
    }
}));
