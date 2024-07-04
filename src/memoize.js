"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valuesEqual = void 0;
exports.memoize = memoize;
var DEBUG = false;
var valuesEqual = function (left, right) {
    if (left === right)
        return true; // Are exactly the same values?
    if (typeof left !== typeof right)
        return false; // Do they have different types?
    // Are both values arrays?
    if (Array.isArray(left) && Array.isArray(right)) {
        if (left.length !== right.length)
            return false; // Arrays have different lengths?
        return left.every(function (leftValue, i) { return (0, exports.valuesEqual)(leftValue, right[i]); }); // Do all values match?
    }
    // Are both values objects? PS: one (and only one) of them could possibly be `null`.
    if (typeof left === 'object' && typeof right === 'object') {
        if (left === null || right === null)
            return false; // Is either value `null`?
        var leftKeys = Object.keys(left);
        var rightKeys = Object.keys(right);
        if (leftKeys.length !== rightKeys.length || // Objects have different number of keys?
            !(0, exports.valuesEqual)(leftKeys.sort(), rightKeys.sort()) // Or different keys (no matter their order)?
        )
            return false;
        // Do all key+value pairs match?
        return Object.entries(left).every(function (_a) {
            var leftKey = _a[0], leftValue = _a[1];
            return (0, exports.valuesEqual)(leftValue, right[leftKey]);
        });
    }
    // Values are not equal!
    return false;
};
exports.valuesEqual = valuesEqual;
// Copy generated types above this line
// ====================================
function memoize(fn, comparisonFn) {
    var cache = [];
    var findCacheIndex = function (cacheEntry) {
        return cache.findIndex(function (_a) {
            var key = _a.key;
            return (comparisonFn !== null && comparisonFn !== void 0 ? comparisonFn : exports.valuesEqual)(key, cacheEntry);
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
