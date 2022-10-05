'use strict';

const { generateBlogController, ALL_SITES } = require('../../../utils/blog-helpers');

module.exports = generateBlogController(ALL_SITES.OriginProtocol);
