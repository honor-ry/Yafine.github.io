"use strict";function _typeof(e){function t(e){return n.apply(this,arguments)}var n,r;function o(e){return r.apply(this,arguments)}return(_typeof="function"==typeof Symbol&&"symbol"===_typeof(Symbol.iterator)?(r=function(e){return void 0===e?"undefined":_typeof(e)},o.toString=function(){return r.toString()},o):(n=function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":void 0===e?"undefined":_typeof(e)},t.toString=function(){return n.toString()},t))(e)}!function(e){if("object"==("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).toolbox=e()}}(function(){return function s(i,c,a){function u(t,e){if(!c[t]){if(!i[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(p)return p(t,!0);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}var o=c[t]={exports:{}};i[t][0].call(o.exports,function(e){return u(i[t][1][e]||e)},o,o.exports,s,i,c,a)}return c[t].exports}for(var p="function"==typeof require&&require,e=0;e<a.length;e++)u(a[e]);return u}({1:[function(e,t,n){function a(e,t){((t=t||{}).debug||c.debug)&&console.log("[sw-toolbox] "+e)}function s(e){var t;return e&&e.cache&&(t=e.cache.name),t=t||c.cache.name,caches.open(t)}function r(e){var t=Array.isArray(e);if(t&&e.forEach(function(e){"string"==typeof e||e instanceof Request||(t=!1)}),!t)throw new TypeError("The precache method expects either an array of strings and/or Requests or a Promise that resolves to an array of strings and/or Requests.");return e}var i,c=e("./options"),u=e("./idb-cache-expiration");t.exports={debug:a,fetchAndCache:function(r,o){var t=(o=o||{}).successResponses||c.successResponses;return fetch(r.clone()).then(function(e){return"GET"===r.method&&t.test(e.status)&&s(o).then(function(n){n.put(r,e).then(function(){var e,t=o.cache||c.cache;(t.maxEntries||t.maxAgeSeconds)&&t.name&&(e=function(e,n,t){var r=e.url,o=t.maxAgeSeconds,s=t.maxEntries,i=t.name,c=Date.now();return a("Updating LRU order for "+r+". Max entries is "+s+", max age is "+o),u.getDb(i).then(function(e){return u.setTimestampForUrl(e,r,c)}).then(function(e){return u.expireEntries(e,s,o,c)}).then(function(e){a("Successfully updated IDB.");var t=e.map(function(e){return n.delete(e)});return Promise.all(t).then(function(){a("Done with cache cleanup.")})}).catch(function(e){a(e)})}.bind(null,r,n,t),i=i?i.then(e):e())})}),e.clone()})},openCache:s,renameCache:function(t,e,n){return a("Renaming cache: ["+t+"] to ["+e+"]",n),caches.delete(e).then(function(){return Promise.all([caches.open(t),caches.open(e)]).then(function(e){var n=e[0],r=e[1];return n.keys().then(function(e){return Promise.all(e.map(function(t){return n.match(t).then(function(e){return r.put(t,e)})}))}).then(function(){return caches.delete(t)})})})},cache:function(t,e){return s(e).then(function(e){return e.add(t)})},uncache:function(t,e){return s(e).then(function(e){return e.delete(t)})},precache:function(e){e instanceof Promise||r(e),c.preCacheItems=c.preCacheItems.concat(e)},validatePrecacheInput:r,isResponseFresh:function(e,t,n){if(!e)return!1;if(t){var r=e.headers.get("date");if(r&&new Date(r).getTime()+1e3*t<n)return!1}return!0}}},{"./idb-cache-expiration":2,"./options":4}],2:[function(e,t,n){var o="sw-toolbox-",s=1,u="store",p="url",h="timestamp",i={};t.exports={getDb:function(e){return e in i||(i[e]=(r=e,new Promise(function(e,t){var n=indexedDB.open(o+r,s);n.onupgradeneeded=function(){n.result.createObjectStore(u,{keyPath:p}).createIndex(h,h,{unique:!1})},n.onsuccess=function(){e(n.result)},n.onerror=function(){t(n.error)}}))),i[e];var r},setTimestampForUrl:function(r,o,s){return new Promise(function(e,t){var n=r.transaction(u,"readwrite");n.objectStore(u).put({url:o,timestamp:s}),n.oncomplete=function(){e(r)},n.onabort=function(){t(n.error)}})},expireEntries:function(e,n,t,r){return i=e,a=r,((c=t)?new Promise(function(e,t){var r=1e3*c,o=[],n=i.transaction(u,"readwrite"),s=n.objectStore(u);s.index(h).openCursor().onsuccess=function(e){var t=e.target.result;if(t&&a-r>t.value[h]){var n=t.value[p];o.push(n),s.delete(n),t.continue()}},n.oncomplete=function(){e(o)},n.onabort=t}):Promise.resolve([])).then(function(t){return r=e,((a=n)?new Promise(function(e,t){var o=[],n=r.transaction(u,"readwrite"),s=n.objectStore(u),i=s.index(h),c=i.count();i.count().onsuccess=function(){var r=c.result;a<r&&(i.openCursor().onsuccess=function(e){var t=e.target.result;if(t){var n=t.value[p];o.push(n),s.delete(n),r-o.length>a&&t.continue()}})},n.oncomplete=function(){e(o)},n.onabort=t}):Promise.resolve([])).then(function(e){return t.concat(e)});var r,a});var i,c,a}}},{}],3:[function(e,t,n){function r(e){return e.reduce(function(e,t){return e.concat(t)},[])}e("serviceworker-cache-polyfill");var o=e("./helpers"),s=e("./router"),i=e("./options");t.exports={fetchListener:function(e){var t=s.match(e.request);t?e.respondWith(t(e.request)):s.default&&"GET"===e.request.method&&0===e.request.url.indexOf("http")&&e.respondWith(s.default(e.request))},activateListener:function(e){o.debug("activate event fired");var t=i.cache.name+"$$$inactive$$$";e.waitUntil(o.renameCache(t,i.cache.name))},installListener:function(e){var t=i.cache.name+"$$$inactive$$$";o.debug("install event fired"),o.debug("creating cache ["+t+"]"),e.waitUntil(o.openCache({cache:{name:t}}).then(function(t){return Promise.all(i.preCacheItems).then(r).then(o.validatePrecacheInput).then(function(e){return o.debug("preCache list: "+(e.join(", ")||"(none)")),t.addAll(e)})}))}}},{"./helpers":1,"./options":4,"./router":6,"serviceworker-cache-polyfill":16}],4:[function(e,t,n){var r;r=self.registration?self.registration.scope:self.scope||new URL("./",self.location).href,t.exports={cache:{name:"$$$toolbox-cache$$$"+r+"$$$",maxAgeSeconds:null,maxEntries:null,queryOptions:null},debug:!1,networkTimeoutSeconds:null,preCacheItems:[],successResponses:/^0|([123]\d\d)|(40[14567])|410$/}},{}],5:[function(e,t,n){function r(e,t,n,r){t instanceof RegExp?this.fullUrlRegExp=t:(0!==t.indexOf("/")&&(t=o+t),this.keys=[],this.regexp=s(t,this.keys)),this.method=e,this.options=r,this.handler=n}var o=new URL("./",self.location).pathname,s=e("path-to-regexp");r.prototype.makeHandler=function(e){var n;if(this.regexp){var r=this.regexp.exec(e);n={},this.keys.forEach(function(e,t){n[e.name]=r[t+1]})}return function(e){return this.handler(e,n,this.options)}.bind(this)},t.exports=r},{"path-to-regexp":15}],6:[function(e,t,n){function c(e,t){for(var n=e.entries(),r=n.next(),o=[];!r.done;)new RegExp(r.value[0]).test(t)&&o.push(r.value[1]),r=n.next();return o}function o(){this.routes=new Map,this.routes.set(RegExp,new Map),this.default=null}var u=e("./route"),p=e("./helpers");["get","post","put","delete","head","any"].forEach(function(r){o.prototype[r]=function(e,t,n){return this.add(r,e,t,n)}}),o.prototype.add=function(e,t,n,r){var o;r=r||{},o=t instanceof RegExp?RegExp:(o=r.origin||self.location.origin)instanceof RegExp?o.source:o.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),e=e.toLowerCase();var s=new u(e,t,n,r);this.routes.has(o)||this.routes.set(o,new Map);var i=this.routes.get(o);i.has(e)||i.set(e,new Map);var c=i.get(e),a=s.regexp||s.fullUrlRegExp;c.has(a.source)&&p.debug('"'+t+'" resolves to same regex as existing route.'),c.set(a.source,s)},o.prototype.matchMethod=function(e,t){var n=new URL(t),r=n.origin,o=n.pathname;return this._match(e,c(this.routes,r),o)||this._match(e,[this.routes.get(RegExp)],t)},o.prototype._match=function(e,t,n){if(0===t.length)return null;for(var r=0;r<t.length;r++){var o=t[r],s=o&&o.get(e.toLowerCase());if(s){var i=c(s,n);if(0<i.length)return i[0].makeHandler(n)}}return null},o.prototype.match=function(e){return this.matchMethod(e.method,e.url)||this.matchMethod("any",e.url)},t.exports=new o},{"./helpers":1,"./route":5}],7:[function(e,t,n){var s=e("../options"),i=e("../helpers");t.exports=function(n,e,r){var o=(r=r||{}).cache||s.cache,t=o.queryOptions;return i.debug("Strategy: cache first ["+n.url+"]",r),i.openCache(r).then(function(e){return e.match(n,t).then(function(e){var t=Date.now();return i.isResponseFresh(e,o.maxAgeSeconds,t)?e:i.fetchAndCache(n,r)})})}},{"../helpers":1,"../options":4}],8:[function(e,t,n){var s=e("../options"),i=e("../helpers");t.exports=function(t,e,n){var r=(n=n||{}).cache||s.cache,o=r.queryOptions;return i.debug("Strategy: cache only ["+t.url+"]",n),i.openCache(n).then(function(e){return e.match(t,o).then(function(e){var t=Date.now();if(i.isResponseFresh(e,r.maxAgeSeconds,t))return e})})}},{"../helpers":1,"../options":4}],9:[function(e,t,n){var u=e("../helpers"),p=e("./cacheOnly");t.exports=function(i,c,a){return u.debug("Strategy: fastest ["+i.url+"]",a),new Promise(function(t,n){function r(e){s.push(e.toString()),o?n(new Error('Both cache and network failed: "'+s.join('", "')+'"')):o=!0}function e(e){e instanceof Response?t(e):r("No result returned")}var o=!1,s=[];u.fetchAndCache(i.clone(),a).then(e,r),p(i,c,a).then(e,r)})}},{"../helpers":1,"./cacheOnly":8}],10:[function(e,t,n){t.exports={networkOnly:e("./networkOnly"),networkFirst:e("./networkFirst"),cacheOnly:e("./cacheOnly"),cacheFirst:e("./cacheFirst"),fastest:e("./fastest")}},{"./cacheFirst":7,"./cacheOnly":8,"./fastest":9,"./networkFirst":11,"./networkOnly":12}],11:[function(e,t,n){var r=e("../options"),l=e("../helpers");t.exports=function(i,e,c){var a=(c=c||{}).cache||r.cache,u=a.queryOptions,p=c.successResponses||r.successResponses,h=c.networkTimeoutSeconds||r.networkTimeoutSeconds;return l.debug("Strategy: network first ["+i.url+"]",c),l.openCache(c).then(function(e){var t,n,r=[];if(h){var o=new Promise(function(r){t=setTimeout(function(){e.match(i,u).then(function(e){var t=Date.now(),n=a.maxAgeSeconds;l.isResponseFresh(e,n,t)&&r(e)})},1e3*h)});r.push(o)}var s=l.fetchAndCache(i,c).then(function(e){if(t&&clearTimeout(t),p.test(e.status))return e;throw l.debug("Response was an HTTP error: "+e.statusText,c),n=e,new Error("Bad response")}).catch(function(t){return l.debug("Network or response error, fallback to cache ["+i.url+"]",c),e.match(i,u).then(function(e){if(e)return e;if(n)return n;throw t})});return r.push(s),Promise.race(r)})}},{"../helpers":1,"../options":4}],12:[function(e,t,n){var r=e("../helpers");t.exports=function(e,t,n){return r.debug("Strategy: network only ["+e.url+"]",n),fetch(e)}},{"../helpers":1}],13:[function(e,t,n){var r=e("./options"),o=e("./router"),s=e("./helpers"),i=e("./strategies"),c=e("./listeners");s.debug("Service Worker Toolbox is loading"),self.addEventListener("install",c.installListener),self.addEventListener("activate",c.activateListener),self.addEventListener("fetch",c.fetchListener),t.exports={networkOnly:i.networkOnly,networkFirst:i.networkFirst,cacheOnly:i.cacheOnly,cacheFirst:i.cacheFirst,fastest:i.fastest,router:o,options:r,cache:s.cache,uncache:s.uncache,precache:s.precache}},{"./helpers":1,"./listeners":3,"./options":4,"./router":6,"./strategies":10}],14:[function(e,t,n){t.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},{}],15:[function(e,t,n){function s(e,t){for(var n,r=[],o=0,s=0,i="",c=t&&t.delimiter||"/";null!=(n=R.exec(e));){var a=n[0],u=n[1],p=n.index;if(i+=e.slice(s,p),s=p+a.length,u)i+=u[1];else{var h=e[s],l=n[2],f=n[3],d=n[4],m=n[5],g=n[6],v=n[7];i&&(r.push(i),i="");var x=null!=l&&null!=h&&h!==l,y="+"===g||"*"===g,w="?"===g||"*"===g,b=n[2]||c,E=d||m;r.push({name:f||o++,prefix:l||"",delimiter:b,optional:w,repeat:y,partial:x,asterisk:!!v,pattern:E?E.replace(/([=!:$\/()])/g,"\\$1"):v?".*":"[^"+k(b)+"]+?"})}}return s<e.length&&(i+=e.substr(s)),i&&r.push(i),r}function l(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function r(p){for(var h=new Array(p.length),e=0;e<p.length;e++)"object"==_typeof(p[e])&&(h[e]=new RegExp("^(?:"+p[e].pattern+")$"));return function(e,t){for(var n="",r=e||{},o=(t||{}).pretty?l:encodeURIComponent,s=0;s<p.length;s++){var i=p[s];if("string"!=typeof i){var c,a=r[i.name];if(null==a){if(i.optional){i.partial&&(n+=i.prefix);continue}throw new TypeError('Expected "'+i.name+'" to be defined')}if(m(a)){if(!i.repeat)throw new TypeError('Expected "'+i.name+'" to not repeat, but received `'+JSON.stringify(a)+"`");if(0===a.length){if(i.optional)continue;throw new TypeError('Expected "'+i.name+'" to not be empty')}for(var u=0;u<a.length;u++){if(c=o(a[u]),!h[s].test(c))throw new TypeError('Expected all "'+i.name+'" to match "'+i.pattern+'", but received `'+JSON.stringify(c)+"`");n+=(0===u?i.prefix:i.delimiter)+c}}else{if(c=i.asterisk?encodeURI(a).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()}):o(a),!h[s].test(c))throw new TypeError('Expected "'+i.name+'" to match "'+i.pattern+'", but received "'+c+'"');n+=i.prefix+c}}else n+=i}return n}}function k(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function f(e,t){return e.keys=t,e}function d(e){return e.sensitive?"":"i"}function i(e,t,n){m(t)||(n=t||n,t=[]);for(var r=(n=n||{}).strict,o=!1!==n.end,s="",i=0;i<e.length;i++){var c=e[i];if("string"==typeof c)s+=k(c);else{var a=k(c.prefix),u="(?:"+c.pattern+")";t.push(c),c.repeat&&(u+="(?:"+a+u+")*"),s+=u=c.optional?c.partial?a+"("+u+")?":"(?:"+a+"("+u+"))?":a+"("+u+")"}}var p=k(n.delimiter||"/"),h=s.slice(-p.length)===p;return r||(s=(h?s.slice(0,-p.length):s)+"(?:"+p+"(?=$))?"),s+=o?"$":r&&h?"":"(?="+p+"|$)",f(new RegExp("^"+s,d(n)),t)}function c(e,t,n){return m(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?function(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return f(e,t)}(e,t):m(e)?function(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(c(e[o],t,n).source);return f(new RegExp("(?:"+r.join("|")+")",d(n)),t)}(e,t,n):(r=t,i(s(e,o=n),r,o));var r,o}var m=e("isarray");t.exports=c,t.exports.parse=s,t.exports.compile=function(e,t){return r(s(e,t))},t.exports.tokensToFunction=r,t.exports.tokensToRegExp=i;var R=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g")},{isarray:14}],16:[function(e,t,n){!function(){var e=Cache.prototype.addAll,t=navigator.userAgent.match(/(Firefox|Chrome)\/(\d+\.)/);if(t)var n=t[1],r=parseInt(t[2]);e&&(!t||"Firefox"===n&&46<=r||"Chrome"===n&&50<=r)||(Cache.prototype.addAll=function(n){function r(e){this.name="NetworkError",this.code=19,this.message=e}var o=this;return r.prototype=Object.create(Error.prototype),Promise.resolve().then(function(){if(arguments.length<1)throw new TypeError;return n=n.map(function(e){return e instanceof Request?e:String(e)}),Promise.all(n.map(function(e){"string"==typeof e&&(e=new Request(e));var t=new URL(e.url).protocol;if("http:"!==t&&"https:"!==t)throw new r("Invalid scheme");return fetch(e.clone())}))}).then(function(e){if(e.some(function(e){return!e.ok}))throw new r("Incorrect response status");return Promise.all(e.map(function(e,t){return o.put(n[t],e)}))}).then(function(){})},Cache.prototype.add=function(e){return this.addAll([e])})}()},{}]},{},[13])(13)}),self.addEventListener("install",function(){return self.skipWaiting()}),self.addEventListener("active",function(){return self.clients.claim()});var precacheUrls=[];precacheUrls.push("/"),precacheUrls.push("/posts/153b.html"),precacheUrls.push("/posts/7aedb564.html"),precacheUrls.push("/posts/724a.html"),precacheUrls.push("/posts/d0e9.html"),precacheUrls.push("/posts/7fe2.html"),precacheUrls.push("/posts/9620.html"),precacheUrls.push("/posts/51fb.html"),precacheUrls.push("/posts/8094.html"),precacheUrls.push("/posts/ee35.html"),precacheUrls.push("/posts/49fb.html"),precacheUrls.push("/posts/eb3a.html"),precacheUrls.push("/posts/1aa5f497.html"),toolbox.precache(precacheUrls),toolbox.options={networkTimeoutSeconds:30},toolbox.router.any(/hm.baidu.com/,toolbox.networkOnly),toolbox.router.any(/www.google-analytics.com/,toolbox.networkOnly),toolbox.router.any(/.*\.(js|css|jpg|jpeg|png|gif)$/,toolbox.cacheFirst),toolbox.router.any(/\//,toolbox.networkFirst);