# manifest-rev

[![build status](https://img.shields.io/travis/ladjs/manifest-rev.svg)](https://travis-ci.org/ladjs/manifest-rev)
[![code coverage](https://img.shields.io/codecov/c/github/ladjs/manifest-rev.svg)](https://codecov.io/gh/ladjs/manifest-rev)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/ladjs/manifest-rev.svg)](<>)

> Dynamically load assets into your views, emails, etc. from your `rev-manifest.json` manifest revision file (e.g. `<script src="{{ manifest('foo.js'); }}"></script>` would return `<script src="/foo-0775041dd4.js"></script>` when rendered).


## Table of Contents

* [Install](#install)
* [Usage](#usage)
* [API](#api)
* [Breaking changes in 2.0](#breaking-changes-in-20)
* [Contributors](#contributors)
* [License](#license)


## Install

[npm][]:

```sh
npm install manifest-rev
```

[yarn][]:

```sh
yarn add manifest-rev
```


## Usage

```js
const path = require('path');

const Koa = require('koa');
const manifestRev = require('manifest-rev');

const app = new Koa();

app.use((ctx, next) => {
  ctx.state.manifest = manifestRev({
    manifest: path.join(__dirname, 'build', 'rev-manifest.json'),
    prepend: '/'
  });
  return next();
});

// ...
```

2. Call the `manifest(str, ?prop)` helper function in your views when you need to include assets (requires a templating engine).

   > [pug][]:

   ```pug
   html
     head
       title Foo
     body
       h1 Foo
       script(src=manifest('foo.js', 'path'))
   ```

   > [ejs][]

   ```ejs
   <html>
     <head>
       <title>Foo</title>
     </head>
     <body>
       <h1>Foo</h1>
       <script src="<%= manifest('foo.js', 'path'); %>" integrity="<%= manifest('foo.js', 'integrity') %>"></script>
     </body>
   </html>
   ```

   > [nunjucks][] (via [koa-nunjucks-promise][]):

   ```html
   <html>
     <head>
       <title>Foo</title>
     </head>
     <body>
       <h1>Foo</h1>
       <script src="{{ manifest('foo.js'); }}" integrity="{{ manifest('foo.js', 'integrity'); }}"></script>
     </body>
   </html>
   ```


## API

* `manifestRev(options)` - accepts a required `options` argument for setup. Returns middleware for use in `app.use` statement (which in turn binds to `ctx.state` a helper function called `manifest`). Here are the properties accepts in the `options` argument.

  * `manifest` (**required**) - path to a valid `rev-manifest.json` file (e.g. as built by [gulp-rev][] or [gulp-rev-all][])
  * `prepend` (optional) - string to prepend before file paths rendered after lookup (e.g. if you type `{{ manifest('foo.js'); }}` in your view, and you have passed `prepend: '/dist/'` in your setup, then your tag would render as `<script src="/dist/foo-0775041dd4.js"></script>` (defaults to `/`)

* `manifest(str)` - the helper function returned when `manifestRev` is invoked in your app. Returns the string found from a lookup in your `rev-manifest.json` file for the `str` argument passed (e.g. if you type `{{ manifest('foo.js'); }}` in your view, then it returns for the value of the `foo.js` property as defined in your `manifest` file, such as `foo-0775041dd4.js`). If the found is not found, then the input `str` argument is returned.


## Breaking changes in 2.0

* `manifest(str)` is now `manifest(str, prop)` which now accepts a following property within your `rev-manifest.json` file. `prop` is optional and defaults to the path of the rev'd file. For example if you type `{{ manifest('foo.js', 'integrity'); }}` in your view, then it returns for the value of the `foo.js` file `integrity` property as defined in your `manifest` file, such as `sha256-YEWYfCFP9yc5DAF8K5AtLEyFuKZ1MNw+xQPm8g70LYY=`). If the found is not found, then the input `str` argument is returned.


## Contributors

| Name           | Website                    |
| -------------- | -------------------------- |
| **Nick Baugh** | <http://niftylettuce.com/> |


## License

[MIT](LICENSE) © [Nick Baugh](http://niftylettuce.com/)


## 

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/

[koa-nunjucks-promise]: https://github.com/hanai/koa-nunjucks-promise

[gulp-rev-all]: https://github.com/smysnk/gulp-rev-all

[gulp-rev]: https://github.com/sindresorhus/gulp-rev

[nunjucks]: https://mozilla.github.io/nunjucks/

[pug]: https://github.com/pugjs/pug

[ejs]: http://ejs.co/
