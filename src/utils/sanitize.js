const { pick, omit } = require('lodash');

function sanitizePost(post) {
  if (!post) return post;

  if (Array.isArray(post)) {
    return post.map((p) => sanitizePost(p));
  }

  return {
    ...pick(post, [
      'title',
      'body',
      'slug',
      'locale',
      'publishedAt',
      'updatedAt',
      'publishBackdate',
    ]),
    cover: sanitizeMedia(post.cover),
    cardCover: sanitizeMedia(post.cardCover),
    category: sanitizeCategory(post.category),
    author: sanitizeAuthor(post.author),
    seo: sanitizeSeo(post.seo),
  };
}

function sanitizeCategory(cat) {
  if (!cat) return cat;

  if (Array.isArray(cat)) {
    return cat.map((c) => sanitizeCategory(c));
  }

  return pick(cat, ['name', 'slug', 'description']);
}

function sanitizeAuthor(author) {
  if (!author) return author;

  if (Array.isArray(author)) {
    return author.map((a) => sanitizeAuthor(a));
  }

  return {
    ...pick(author, ['name', 'bio']),
    avatar: sanitizeMedia(author.avatar),
  };
}

function getFullUrl(absoluteUrl) {
  if (!absoluteUrl) {
    return absoluteUrl;
  }

  if (absoluteUrl.startsWith('http')) {
    return absoluteUrl;
  }

  const { MY_HEROKU_URL, HOST, PORT } = process.env;

  let cmsHost = 'http://localhost:1337';

  if (MY_HEROKU_URL) {
    // Making the assumption that we only use heroku for deployment
    cmsHost = MY_HEROKU_URL;
  } else if (HOST && PORT) {
    // Use env if it's set
    cmsHost = `http://${HOST}:${PORT}`;
  }

  if (cmsHost.endsWith('/')) {
    cmsHost = cmsHost.slice(0, -1);
  }

  return `${cmsHost}${absoluteUrl}`;
}

function sanitizeMedia(media) {
  if (!media) return media;

  return {
    ...pick(media, [
      'url',
      'previewUrl',
      'width',
      'height',
      'caption',
      'alternativeText',
      'formats',
      'mime',
      'size',
      'ext',
    ]),
    url: getFullUrl(media.url),
    previewUrl: getFullUrl(media.previewUrl),
  };
}

function sanitizeTeam(team) {
  if (!team) return team;

  if (Array.isArray(team)) {
    return team.map((t) => sanitizeTeam(t));
  }

  return {
    ...pick(team, [
      'title',
      'name',
      'role',
      'bio',
      'linkedinUrl',
      'twitterUrl',
      'otherUrl',
      'locale',
      'rank',
    ]),
    avatar: sanitizeMedia(team.avatar),
  };
}

function sanitizeSeo(seo) {
  if (!seo) return seo;

  return {
    ...pick(seo, [
      'metaTitle',
      'metaDescription',
      'metaRobots',
      'structuredData',
      'metaViewport',
      'canonicalRul',
    ]),
    metaImage: sanitizeMedia(seo.metaImage),
  };
}

function sanitizePage(page) {
  if (!page) return page;

  if (Array.isArray(page)) {
    return page.map((p) => sanitizePage(p));
  }

  return omit(page.seo, ['id']);
}

module.exports = {
  sanitizeMedia,
  sanitizePost,
  sanitizeAuthor,
  sanitizeCategory,
  sanitizeTeam,
  sanitizePage,
};
