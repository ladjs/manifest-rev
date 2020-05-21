module.exports = function(opts) {
  const PROD = process.env.NODE_ENV === 'production';

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
      const val = String((manifest[str] && manifest[str][prop]) || str);
      if (prop === 'path') return opts.prepend + val;
      if (prop === 'integrity') return val === str ? false : val;
      output = PROD ? val : false;
    } catch (err) {}

    return output;
  };
};
