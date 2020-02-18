'use strict'

var crypto = require('crypto')

var etagCache = require('./etag-cache.json')

module.exports = etag

function etag (entity, opts) {
  if (Object(entity) === entity) {
    opts = entity
    entity = opts.entity
  }

  var error = false
  opts = opts || {}
  opts.algorithm = opts.algorithm || 'md5'
  opts.encoding = opts.encoding || 'utf8'
  opts.output = opts.output || 'base64'

  var match

  Object.keys(etagCache).forEach(function (k) {
    match = (etagCache[k].algorithm === opts.algorithm &&
      etagCache[k].encoding === opts.encoding &&
      etagCache[k].output === opts.output &&
      entity === Buffer.from(etagCache[k].content.data).toString()) &&
      k
  })

  if (match) { return match }

  var hash

  try {
    hash = crypto
      .createHash(opts.algorithm)
      .update(entity, opts.encoding)
  } catch (e) {
    error = true
  }

  if (!opts.output || opts.output === 'base64') {
    try {
      hash = hash
        .digest('base64')
        .replace(/=+$/, '')
    } catch (e) {
      error = true
    }

    if (!error) {
      return hash
    }
  }

  try {
    hash = hash.digest(opts.output)
  } catch (e) {
    error = true
  }

  if (error) {
    return Error('oh oh')
  }

  return hash
}
