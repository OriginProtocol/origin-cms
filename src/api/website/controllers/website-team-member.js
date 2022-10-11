'use strict';

const { getLocalizedTeam } = require('../../../utils/localization');
const { sanitizeTeam } = require('../../../utils/sanitize');

class TeamController {
  constructor(strapi) {
    this.strapi = strapi;
    this.service = strapi.service('api::website.website-team-member');
  }

  async get(ctx) {
    const { locale } = ctx.params;

    const query = {
      filters: {
        locale: 'en',
      },
      pagination: {
        // Just making sure to return all data at once
        pageSize: 100,
      },
      populate: {
        avatar: true,
      },
      sort: { rank: 'asc' },
    };

    if (locale && locale !== 'en') {
      // Include localization if any
      query.populate.localizations = {
        filters: {
          locale,
        },
      };
    }

    const { results } = await this.service.find(query);

    const allTeam = sanitizeTeam(getLocalizedTeam(results));

    const groupedByRole = allTeam.reduce((all, current) => {
      const newVal = { ...all };

      if (!newVal[current.role]) {
        newVal[current.role] = [];
      }
      newVal[current.role] = [...newVal[current.role], current];

      return newVal;
    }, {});

    return {
      data: groupedByRole,
    };
  }
}

module.exports = ({ strapi }) => new TeamController(strapi);
