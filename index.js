const PROD = process.env.NODE_ENV === 'production';

module.exports = function(opts) {
  if (typeof opts !== 'object') {
    throw new TypeError('`options` argument required');
  }

  if (typeof opts.manifest !== 'string') {
    throw new TypeError('`manifest` property is required');
  }

  if (typeof opts.prepend !== 'undefined' && typeof opts.prepend !== 'string') {
    throw new TypeError('`prepend` property defined, but it was not a string');
  }

  opts.logger = opts.logger || console;
  opts.prepend = opts.prepend || '/';

  let manifest = {};

  try {
    manifest = require(opts.manifest);
  } catch (err) {
    opts.logger.error(err);
  }

  return str => {
    let output = opts.prepend + str;
    try {
      if (!PROD) manifest = require(opts.manifest);
      output = opts.prepend + (manifest[str] || str);
    } catch (err) {
      opts.logger.error(err);
    }

    return output;
  };
};
