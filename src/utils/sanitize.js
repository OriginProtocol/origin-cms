const { pick } = require('lodash');

function sanitizePost(post) {
  if (!post) return post

  if (Array.isArray(post)) {
    return post.map((p) => sanitizePost(p));
  }

  return {
    ...pick(post, ['title', 'body', 'slug', 'locale', 'publishedAt', 'updatedAt']),
    cover: sanitizeMedia(post.cover),
    category: sanitizeCategory(post.category),
    author: sanitizeAuthor(post.author),
  };
}

function sanitizeCategory(cat) {
  if (!cat) return cat

  if (Array.isArray(cat)) {
    return cat.map((c) => sanitizeCategory(c));
  }

  return pick(cat, ['name', 'slug', 'description']);
}

function sanitizeAuthor(author) {
  if (!author) return author

  if (Array.isArray(author)) {
    return author.map((a) => sanitizeAuthor(a));
  }

  return {
    ...pick(author, ['name', 'bio']),
    avatar: sanitizeMedia(author.avatar),
  };
}

function sanitizeMedia(media) {
  return pick(media, [
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
  ]);
}

module.exports = {
  sanitizeMedia,
  sanitizePost,
  sanitizeAuthor,
  sanitizeCategory,
}
