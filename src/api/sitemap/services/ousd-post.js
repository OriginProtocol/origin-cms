'use strict';

/**
 * sitemap service
 */

module.exports = () => ({
  async getSlugs() {
    const slugs = await strapi.entityService.findMany('api::blog.ousd-post', {
      filters: {
        publishedAt: {
          $notNull: true
        },
        // locale: 'en'
      },
      // fields: ['slug'],
      // populate: {
      //   localizations: {
      //     fields: ['locale'],
      //     // locale: true
      //   }
      // }
    })

    return slugs
  }
});
