/* SERVICE-WORKER.JS */

// Via https://github.com/coonsta/cache-polyfill/blob/master/dist/serviceworker-cache-polyfill.js
// Adds in some functionality missing in Chrome 40.

if (!Cache.prototype.add) {
  Cache.prototype.add = function add(request) {
    return this.addAll([request]);
  };
}

if (!Cache.prototype.addAll) {
  Cache.prototype.addAll = function addAll(requests) {
    var cache = this;

    // Since DOMExceptions are not constructable:
    function NetworkError(message) {
      this.name = 'NetworkError';
      this.code = 19;
      this.message = message;
    }
    NetworkError.prototype = Object.create(Error.prototype);

    return Promise.resolve().then(function() {
      if (arguments.length < 1) throw new TypeError();

      // Simulate sequence<(Request or USVString)> binding:
      var sequence = [];

      requests = requests.map(function(request) {
        if (request instanceof Request) {
          return request;
        }
        else {
          return String(request); // may throw TypeError
        }
      });

      return Promise.all(
        requests.map(function(request) {
          if (typeof request === 'string') {
            request = new Request(request);
          }

          var scheme = new URL(request.url).protocol;

          if (scheme !== 'http:' && scheme !== 'https:') {
            throw new NetworkError("Invalid scheme");
          }

          return fetch(request.clone());
        })
      );
    }).then(function(responses) {
      // TODO: check that requests don't overwrite one another
      // (don't think this is possible to polyfill due to opaque responses)
      return Promise.all(
        responses.map(function(response, i) {
          return cache.put(requests[i], response);
        })
      );
    }).then(function() {
      return undefined;
    });
  };
}

if (!CacheStorage.prototype.match) {
  // This is probably vulnerable to race conditions (removing caches etc)
  CacheStorage.prototype.match = function match(request, opts) {
    var caches = this;

    return this.keys().then(function(cacheNames) {
      var match;

      return cacheNames.reduce(function(chain, cacheName) {
        return chain.then(function() {
          return match || caches.open(cacheName).then(function(cache) {
            return cache.match(request, opts);
          }).then(function(response) {
            match = response;
            return match;
          });
        });
      }, Promise.resolve());
    });
  };
}

(global => {
  console.log('inside service worker!')

  'use strict';

  // Load the sw-tookbox library.
  importScripts('/assets/dist/js/sw-toolbox.js')

  // Turn on debug logging, visible in the Developer Tools' console.
  global.toolbox.options.debug = true;

  toolbox.precache([
    '/welcome-to-ghost/',
    '/assets/dist/css/screen.css',
    '/assets/fonts/casper-icons.woff'
  ]);

  // Set up a handler for HTTP GET requests:
  // - '/(.*)' means any URL pathname will be matched.
  // - toolbox.cacheFirst let us to use the predefined cache strategy for those
  //   requests.
  global.toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
    // Use a dedicated cache for the responses, separate from the default cache.
    cache: {
      name: 'youtube-thumbnails',
      // Store up to 10 entries in that cache.
      maxEntries: 10,
      // Expire any entries that are older than 30 seconds.
      maxAgeSeconds: 30
    },
    // origin allows us to restrict the handler to requests whose origin matches
    // a regexp. In this case, we want to match anything that ends in
    // 'ytimg.com'.
    origin: /\.ytimg\.com$/
  });

  // By default, all requests that don't match our custom handler will use the
  // toolbox.networkFirst cache strategy, and their responses will be stored in
  // the default cache.
  // global.toolbox.router.default = global.toolbox.cacheFirst;

  // Boilerplate to ensure our service worker takes control of the page as soon
  // as possible.
  global.addEventListener('install',
      event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate',
      event => event.waitUntil(global.clients.claim()));
})(self);
