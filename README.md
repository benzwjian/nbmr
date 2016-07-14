# Unit Testing Backbone.js Applications written in AMD with Mocha in Node or Browser

This example is based on [this](https://www.sitepoint.com/unit-testing-backbone-js-applications/) rewritten in module pattern with requirejs.

#### Requirement NPM packages
```sh
$ npm i -g mocha local-web-server
```

#### Here is what each folder and file contains:

* `todos.html`: The skeleton HTML file for our application.
* `testem.json`: The configuration file for Test'Em.
* `.local-web-server.json`: configuration of local-web-server
* `lib/`: A folder for Javascript libraries used by the app itself and the test framework.
  * `lib/backbone-min.js`: Minified version of Backbone.js.
  * `lib/chai.js`: Chai Assertion Library.
  * `lib/jquery-1.9.0.min.js`: Minified version of jQuery.
  * `lib/sinon-1.5.2.js`: Sinon.JS library.
  * `lib/sinon-chai.js`: Sinon.JS Assertions for Chai.
  * `lib/underscore-min.js`: Minified version of Underscore.js.
* `mocks/`: A folder hosts response functions of local-web-server
  * `todos.js`: response a collection of todos in JSON
* `src/`: A folder for our client-side application code.
  * `src/app-todos.js`: Our application.
* `test/`: A folder for test code.
  * `test/app-todos-test.js`: Test code for our application.
  * `test/mocha.opts`: Configuration options for mocha; we'll look at this in the next section.

#### Run local server for development
```sh
$ npm start
```

#### Test
Use Node environment to test
```sh
$ npm test
```

Use browser to test
```sh
$ testem
```
