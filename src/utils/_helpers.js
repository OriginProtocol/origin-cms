'use strict';

const ALL_SITES = {
  OriginProtocol: 'website',
  OUSD: 'ousd',
  OETH: 'oeth',
  Story: 'story',
};

const SITE_HOSTS = {
  [ALL_SITES.OriginProtocol]: process.env.WEBSITE_HOST || 'https://originprotocol.com',
  [ALL_SITES.OUSD]: process.env.OUSD_HOST || 'https://ousd.com',
  [ALL_SITES.OETH]: process.env.OETH_HOST || 'https://oeth.com',
  [ALL_SITES.Story]: process.env.STORY_HOST || 'https://story.xyz',
};

module.exports = {
  ALL_SITES,
  SITE_HOSTS,
};
