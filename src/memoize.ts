const DEBUG = false

type FnType = (...args: never[]) => unknown

type MemoizeCacheType<Fn extends FnType> = {
  key: Parameters<Fn>
  value: ReturnType<Fn>
}[]

interface MemoizeUtils<Fn extends FnType> {
  clearAll: () => void
  getCache: () => MemoizeCacheType<Fn>
  clearEntry: (...args: Parameters<Fn>) => void
}

type comparisonFnType<Fn extends FnType> = (
  left: Parameters<Fn>,
  right: Parameters<Fn>,
) => boolean

type MemoizedFunction<Fn extends FnType> = Fn & MemoizeUtils<Fn>

/**
 * A function that compares two values. Its default behavior is to compare each value individually with
 * the standand `===` JS/TS's strict-equals operator, which basically deals with all primitive types, but
 * the function also takes care of collection-like structures such as objects, maps (with all kinds of keys)
 * and arrays of any depth. And you can freely and safely mix them all. Classes (in fact, class instances),
 * regular expressions, dates and even functions are covered, too. Circular data structures are also
 * supported (so there is no risk of the dreaded "Stack Overflow" error).
 *
 * @param {unknown} left - The left value.
 * @param {unknown} right - The right value.
 * @returns {boolean} - Whether the 2 values are considered the same (i.e. are equal).
 */

export const compareValues = <T>(
  left: T,
  right: T,
  alreadyCompared: { left: unknown; right: unknown }[] = [],
): boolean => {
  if (left === right) return true // Are exactly the same values?

  // Do they have different types (as returned by the `typeof` operator)? In general this is flagged by TS
  // at compile-time (in particular when the type parameter `T` is automatically inferred by TS), but still
  // needed when `T` represents a union or when running in JS.
  if (typeof left !== typeof right) return false

  if (
    alreadyCompared.find(
      item =>
        (item.left === left && item.right === right) ||
        (item.left === right && item.right === left),
    )
  )
    return true

  alreadyCompared.unshift({ left, right })

  // Are both values arrays?
  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) return false // Arrays have different lengths?

    // Do all array items match?
    return left.every((leftValueItem: unknown, i) =>
      compareValues(leftValueItem, right[i] as unknown, alreadyCompared),
    )
  }

  // Are both values functions?
  if (typeof left === 'function' && typeof right === 'function')
    return left.toString() === right.toString() // Compare their string representations.

  // Are both values objects? PS: one (and only one) of them could possibly be `null`.
  if (typeof left === 'object' && typeof right === 'object') {
    if (left === null || right === null) return false // Is either value `null`?

    // Treat a very special case where one of the values is an array (e.g. `[10, 20, 30]`) and the other
    // is an object with array behavior (e.g. `{ 0: 10, 1: 20, 2: 20 }`). It may happen on either side.
    const arrayAndObjectWithArrayBehavior =
      (Array.isArray(left) &&
        right.constructor.name === 'Object' &&
        Object.keys(right).every(key => !Object.is(Number(key), NaN))) ||
      (Array.isArray(right) &&
        left.constructor.name === 'Object' &&
        Object.keys(left).every(key => !Object.is(Number(key), NaN)))

    if (!arrayAndObjectWithArrayBehavior) {
      // Are objects of same type (this time based on their constructors)?
      if (left.constructor.name !== right.constructor.name) return false

      // Are objects of type RegExp or Date?
      if (
        (left instanceof RegExp && right instanceof RegExp) ||
        (left instanceof Date && right instanceof Date)
      )
        return left.toString() === right.toString() // Compare their string representations.

      // Are objects of type Map?
      if (left instanceof Map && right instanceof Map) {
        // Maps have different number of keys?
        if (left.size !== right.size) return false

        // Or different keys (order matter)?
        if (
          !compareValues([...left.keys()], [...right.keys()], alreadyCompared)
        )
          return false

        // Do all key+value pairs match?
        return ([...left.entries()] as [unknown, unknown][]).every(
          ([leftKey, leftValue]) => {
            // Find the corresponding right key. Notice that this key will always be found, given we have
            // already checked that left and right keys match.

            const rightKey = ([...right.keys()] as unknown[]).find(key =>
              compareValues(key, leftKey, alreadyCompared),
            )

            return compareValues(
              leftValue,

              right.get(rightKey) as unknown,

              alreadyCompared,
            )
          },
        )
      }
    }

    // From this point on simply assume both are standard JS objects, used as dictionaries.
    const leftKeys = Object.keys(left)
    const rightKeys = Object.keys(right)

    if (
      leftKeys.length !== rightKeys.length || // Objects have different number of keys?
      !compareValues(leftKeys.sort(), rightKeys.sort(), alreadyCompared) // Or different keys (no matter their order)?
    )
      return false

    // Do all key+value pairs match?
    return Object.entries(left).every(([leftKey, leftValue]) =>
      compareValues(
        leftValue,
        right[leftKey as keyof typeof right],
        alreadyCompared,
      ),
    )
  }

  // Values are not equal!
  return false
}

/**
 * A function that memoizes the result of `fn` based on the actual arguments provided.
 * It can optionally receive a custom comparison function for determining cache hits.
 * Additional utility methods are provided, in order to manage the associated cache.
 *
 * @template Fn - The signature of the memoized function (always inferred automatically by TS).
 * @param {Fn} fn - The function to be memoized.
 * @param {comparisonFnType<Fn>} [comparisonFn] - An optional custom parameter-comparison function for determining cache hits based on the actual arguments passed.
 * @returns {MemoizedFunction<Fn>} - The memoized function with additional utility methods.
 */

export const memoize = <Fn extends FnType>(
  fn: Fn,
  comparisonFn: comparisonFnType<Fn> = compareValues,
): MemoizedFunction<Fn> => {
  const cache: MemoizeCacheType<Fn> = []

  const findCacheIndex = (cacheEntry: Parameters<Fn>) =>
    cache.findIndex(({ key }) => comparisonFn(key, cacheEntry))

  const memoizedFn = ((...args: Parameters<Fn>) => {
    let value: ReturnType<Fn>

    const index = findCacheIndex(args)

    if (index !== -1) {
      if (DEBUG) console.log('Retrieving memoized value for', args)

      value = cache[index].value
    } else {
      value = fn(...args) as ReturnType<Fn>

      cache.unshift({ key: args, value })
    }

    return value
  }) as MemoizedFunction<Fn>

  memoizedFn.clearAll = () => {
    cache.length = 0
  }

  memoizedFn.clearEntry = (...args: Parameters<Fn>) => {
    const index = findCacheIndex(args)

    if (index !== -1) cache.splice(index, 1)
  }

  memoizedFn.getCache = () => cache

  return memoizedFn
}
