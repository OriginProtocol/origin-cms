'use strict';

const ALL_SITES = {
  OriginProtocol: 'website',
  OUSD: 'ousd',
  Story: 'story',
};

const SITE_HOSTS = {
  [ALL_SITES.OriginProtocol]: process.env.WEBSITE_HOST,
  [ALL_SITES.OUSD]: process.env.OUSD_HOST,
  [ALL_SITES.Story]: process.env.STORY_HOST,
};

module.exports = {
  ALL_SITES,
  SITE_HOSTS,
};
