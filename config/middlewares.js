module.exports = [
  'strapi::errors',
  // prettier-ignore
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ['\'self\'', 'https:'],
          'img-src': [
            '\'self\'',
            'data:',
            'blob:',
            'dl.airtable.com',
            `${process.env.AWS_BUCKET}.s3.amazonaws.com`,
          ],
          'media-src': [
            '\'self\'',
            'data:',
            'blob:',
            'dl.airtable.com',
            `${process.env.AWS_BUCKET}.s3.amazonaws.com`,
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
