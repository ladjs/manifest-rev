const path = require('path');
const test = require('ava');

const manifestRev = require('..');

test('throws error without opts object', t => {
  const error = t.throws(manifestRev);
  t.is(error.message, '`options` argument required');
});

test('throws error without opts.manifest string', t => {
  const error = t.throws(() => manifestRev({}));
  t.is(error.message, '`manifest` property is required');
});

test('throws error with opts.prepend non-string with new format', t => {
  const manifest = path.join(__dirname, 'fixtures', 'rev-manifest.json');
  const error = t.throws(() =>
    manifestRev({
      manifest,
      prepend: true
    })
  );
  t.is(error.message, '`prepend` property defined, but it was not a string');
});

test('exposes manifest function with new format', t => {
  const manifest = path.join(__dirname, 'fixtures', 'rev-manifest.json');
  t.true(typeof manifestRev({ manifest }) === 'function');
});

test('returns output when manifest invoked with new format', t => {
  const manifest = path.join(__dirname, 'fixtures', 'rev-manifest.json');
  t.is(manifestRev({ manifest })('script.js'), '/script-d80c4dea53.js');
});

test('returns output of path when manifest invoked with new format', t => {
  const manifest = path.join(__dirname, 'fixtures', 'rev-manifest.json');
  t.is(manifestRev({ manifest })('script.js', 'path'), '/script-d80c4dea53.js');
});

test('returns output of integrity when manifest invoked with new format', t => {
  const manifest = path.join(__dirname, 'fixtures', 'rev-manifest.json');
  t.is(
    manifestRev({ manifest })('script.js', 'integrity'),
    'sha256-YEWYfCFP9yc5DAF8K5AtLEyFuKZ1MNw+xQPm8g70LYY='
  );
});

test('returns output false when manifest invoked with unknown file', t => {
  const manifest = path.join(__dirname, 'fixtures', 'rev-manifest.json');
  t.is(manifestRev({ manifest })('fakescript.js', 'integrity'), false);
});

test('returns output false when manifest invoked with unknown property', t => {
  const manifest = path.join(__dirname, 'fixtures', 'rev-manifest.json');
  t.is(manifestRev({ manifest })('fakescript.js', 'random'), false);
});

test('returns output of integrity when manifest invoked in PROD with new format', t => {
  const manifest = path.join(__dirname, 'fixtures', 'rev-manifest.json');
  process.env.NODE_ENV = 'production';
  t.is(
    manifestRev({ manifest })('script.js', 'integrity'),
    'sha256-YEWYfCFP9yc5DAF8K5AtLEyFuKZ1MNw+xQPm8g70LYY='
  );
  delete process.env.NODE_ENV;
});

test('does not throw when rev-manifest.json manifest file does not exist', t => {
  t.notThrows(() => manifestRev({ manifest: 'foo.json' })('foo.js'));
});
