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
  };
}

function getLocalizedTeam(team) {
  return getLocalizedContent(team);
}

function validateLocaleMiddleware(ctx, next) {
  const { locale } = ctx.params;

  // Make sure locale is 2 to 5 characters long
  // and has only alphabets with hyphens in between
  if (!/^[a-z]{2}(-[a-z]{2})?$/i.test(locale)) {
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
