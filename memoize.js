"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoize = memoize;
var DEBUG = false;
// Copy generated types above this line
// ====================================
function memoize(fn, comparisonFn) {
    var cache = [];
    var findCacheIndex = function (cacheEntry) {
        return cache.findIndex(function (_a) {
            var _b;
            var key = _a.key;
            return (_b = comparisonFn === null || comparisonFn === void 0 ? void 0 : comparisonFn(key, cacheEntry)) !== null && _b !== void 0 ? _b : key.every(function (arg, i) { return arg === cacheEntry[i]; });
        });
    };
    var memoizedFn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var value;
        var index = findCacheIndex(args);
        if (index !== -1) {
            if (DEBUG)
                console.log('Retrieving memoized value for', args);
            value = cache[index].value;
        }
        else {
            value = fn.apply(void 0, args);
            cache.unshift({ key: args, value: value });
        }
        return value;
    };
    memoizedFn.clearAll = function () {
        cache.length = 0;
    };
    memoizedFn.clearEntry = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var index = findCacheIndex(args);
        if (index !== -1)
            cache.splice(index, 1);
    };
    memoizedFn.getCache = function () { return cache; };
    return memoizedFn;
}
