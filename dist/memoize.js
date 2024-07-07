"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareValues = void 0;
exports.memoize = memoize;
const DEBUG = false;
const compareValues = (left, right) => {
    if (left === right)
        return true; // Are exactly the same values?
    if (typeof left !== typeof right)
        return false; // Do they have different types? In general flagged by TS at compile-time, but still needed when running is JS.
    // Are both values arrays?
    if (Array.isArray(left) && Array.isArray(right)) {
        if (left.length !== right.length)
            return false; // Arrays have different lengths?
        return left.every((leftValue, i) => (0, exports.compareValues)(leftValue, right[i])); // Do all values match?
    }
    // Are both values objects? PS: one (and only one) of them could possibly be `null`.
    if (typeof left === 'object' && typeof right === 'object') {
        if (left === null || right === null)
            return false; // Is either value `null`?
        const leftKeys = Object.keys(left);
        const rightKeys = Object.keys(right);
        if (leftKeys.length !== rightKeys.length || // Objects have different number of keys?
            !(0, exports.compareValues)(leftKeys.sort(), rightKeys.sort()) // Or different keys (no matter their order)?
        )
            return false;
        // Do all key+value pairs match?
        return Object.entries(left).every(([leftKey, leftValue]) => (0, exports.compareValues)(leftValue, right[leftKey]));
    }
    // Values are not equal!
    return false;
};
exports.compareValues = compareValues;
// Copy generated types above this line
// ====================================
function memoize(fn, comparisonFn) {
    const cache = [];
    const findCacheIndex = (cacheEntry) => cache.findIndex(({ key }) => (comparisonFn !== null && comparisonFn !== void 0 ? comparisonFn : exports.compareValues)(key, cacheEntry));
    const memoizedFn = (...args) => {
        let value;
        const index = findCacheIndex(args);
        if (index !== -1) {
            if (DEBUG)
                console.log('Retrieving memoized value for', args);
            value = cache[index].value;
        }
        else {
            value = fn(...args);
            cache.unshift({ key: args, value });
        }
        return value;
    };
    memoizedFn.clearAll = () => {
        cache.length = 0;
    };
    memoizedFn.clearEntry = (...args) => {
        const index = findCacheIndex(args);
        if (index !== -1)
            cache.splice(index, 1);
    };
    memoizedFn.getCache = () => cache;
    return memoizedFn;
}
