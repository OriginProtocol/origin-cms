'use strict';

const { omit } = require('lodash');

function getLocalizedContent(obj) {
  if (!obj) return obj;

  if (Array.isArray(obj)) {
    return obj.map((o) => getLocalizedContent(o));
  }

  if (obj?.localizations && obj.localizations.length) {
    return {
      ...omit(obj, 'localizations'),
      ...obj.localizations[0],
    };
  }

  return omit(obj, 'localizations');
}

function getLocalizedPost(post) {
  if (!post) return post;

  if (Array.isArray(post)) {
    return post.map((p) => getLocalizedPost(p));
  }

  const localizedPost = getLocalizedContent(post);

  return {
    ...localizedPost,
    author: getLocalizedContent(post.author),
    category: getLocalizedContent(post.category),
    seo: getLocalizedContent(post.seo),
  };
}

function getLocalizedTeam(team) {
  return getLocalizedContent(team);
}

// Ref: https://www.w3.org/International/talks/1002-flarenet/slides.pdf
const localeRegex = /^[a-z]{2,4}(-[A-Z][a-z]{3})?(-([A-Z]{2}|[0-9]{3}))?$/;

function validateLocaleMiddleware(ctx, next) {
  const { locale } = ctx.params;

  if (!localeRegex.test(locale)) {
    ctx.response.badRequest('Invalid locale');
    return;
  }

  return next();
}

module.exports = {
  getLocalizedContent,
  getLocalizedPost,
  getLocalizedTeam,
  validateLocaleMiddleware,
};
