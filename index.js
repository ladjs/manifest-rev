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

  opts.prepend = opts.prepend || '/';

  let manifest = {};

  try {
    manifest = require(opts.manifest);
  } catch (err) {}

  return (str, prop = 'path') => {
    let output = opts.prepend + str;
    try {
      if (!PROD) manifest = require(opts.manifest);
      if (typeof manifest[str] === 'string') {
        output = opts.prepend + String(manifest[str] || str);
      } else if (typeof manifest[str] === 'object') {
        const val = String((manifest[str] && manifest[str][prop]) || str);
        output = prop === 'path' ? opts.prepend + val : val;
      }
    } catch (err) {}

    return output;
  };
};
