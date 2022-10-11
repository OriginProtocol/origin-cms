'use strict';

const { PageController } = require('../../../utils/page-helpers');
const { ALL_SITES } = require('../../../utils/_helpers');

module.exports = ({ strapi }) => new PageController(ALL_SITES.OriginProtocol, strapi);
