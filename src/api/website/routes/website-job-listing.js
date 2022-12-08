'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::website.website-job-listing', {
  only: ['find', 'findOne'],
});
