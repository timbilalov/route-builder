!function(t){var n={};function e(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,e),r.l=!0,r.exports}e.m=t,e.c=n,e.d=function(t,n,o){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:o})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(e.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var r in t)e.d(o,r,function(n){return t[n]}.bind(null,r));return o},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="/media/js",e(e.s=0)}([function(t,n,e){"use strict";e.r(n);function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(t){if(!isNaN(t)){var n=performance.now(),e=[],r=function t(n){if(!isNaN(n))return 1===n?1:n*t(n-1);console.warn("Wrong argument's type for function 'factorial': number required, but ".concat(o(n)," passed."))}(t);!function t(n,o){if(1===n)e.push(Array.from(o));else{t(n-1,o);for(var r=0;r<n-1;r++){if(n%2==0){var u=o[r],a=o[n-1];o[r]=a,o[n-1]=u}else{var c=o[0],i=o[n-1];o[0]=i,o[n-1]=c}t(n-1,o)}}}(t,Array.from(new Array(t)).map((function(t,n){return n+1})));var u=new Set(e.map((function(t){return t.toString()}))).size;e.length===r&&e.length===u||console.warn("Something wrong with permutations for N=".concat(t,". Counters: total - ").concat(e.length,", unique - ").concat(u,", both total and unique must be - ").concat(r));var a=performance.now();return console.log("found ".concat(e.length," permutations in ").concat(a-n," ms")),e}console.warn("Wrong argument's type for function 'findAllPermutations': number required, but ".concat(o(t)," passed."))}function u(t,n){return Math.sqrt(Math.pow(Math.abs(1e3*t[0]-1e3*n[0]),2)+Math.pow(Math.abs(1e3*t[1]-1e3*n[1]),2))}function a(t,n){for(var e,o=performance.now(),r=u,a=1/0,c=function(o){var u=t[o],c=u.map((function(t){return n[t]})).reduce((function(t,n,e){var o,a=n;return o=1===e?r(t,n):t.distance+r(t.prev,n),e<u.length-1?{distance:o,prev:a}:o}));c<a&&(a=c,e=u)},i=0;i<t.length;i++)c(i);var f=performance.now();return console.log("found min distance for ".concat(t.length," different route variants in ").concat(f-o," ms")),e}function c(t){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}self.addEventListener("message",(function(t){var n=t.data;if("object"!==c(n))throw new Error("Wrong argument's type for worker's postMessage function: object required, but ".concat(c(n)," passed."));var e=null,o=n.type,u=n.value;switch(o){case"permutations":"number"==typeof u&&(e=r(u));break;case"minRouteDistance":if("object"===c(u))e=a(u.routeVariants,u.coordinates);break;case"combinedRouteCalc":if("object"===c(u)){var i=u.coordinates;e=a(r(i.length-1).map((function(t){return[0].concat(t)})),i)}}e=JSON.stringify(e),postMessage(e)}))}]);