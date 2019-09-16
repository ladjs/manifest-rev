const path = require('path');
const test = require('ava');

const manifestRev = require('..');

const manifest = path.join(__dirname, 'fixtures', 'rev-manifest.json');

test('throws error without opts object', t => {
  const error = t.throws(manifestRev);
  t.is(error.message, '`options` argument required');
});

test('throws error without opts.manifest string', t => {
  const error = t.throws(() => manifestRev({}));
  t.is(error.message, '`manifest` property is required');
});

test('throws error with opts.prepend non-string', t => {
  const error = t.throws(() =>
    manifestRev({
      manifest,
      prepend: true
    })
  );
  t.is(error.message, '`prepend` property defined, but it was not a string');
});

test('exposes manifest function', t => {
  t.true(typeof manifestRev({ manifest }) === 'function');
});

test('returns output when manifest invoked', t => {
  t.is(manifestRev({ manifest })('foo.js'), '/foo.js');
});

test('does not throw when rev-manifest.json manifest file does not exist', t => {
  t.notThrows(() => manifestRev({ manifest: 'foo.json' })('foo.js'));
});
