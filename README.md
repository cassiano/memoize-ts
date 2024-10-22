# 100% type-safe `memoize()` function written in TS

> [Memoization](https://en.wikipedia.org/wiki/Memoization) is an optimization technique that makes applications and functions more efficient by storing the results of function calls in a cache and returning the cached results when the same inputs occur, instead of computing it again.
>
> This package provides a simple way to transform [pure functions](https://en.wikipedia.org/wiki/Pure_function) into their memoized versions using a [Higher-Order Function](https://en.wikipedia.org/wiki/Higher-order_function) (HOF) called "memoize()", while keeping the original function's signature.

## Features

- 100% type-safe
- Supports functions that have up to 30 parameters
- Supports [recursive functions](#supporting-recursive-functions)
- Provides methods for managing the [internal cache](#managing-the-internal-cache)
- Provides a default callback function for searching entries in the cache, while supporting a [custom parameter-comparison callback function](#optional-custom-parameter-comparison-callback-function)
- Fully compatible with JavaScript
- Very small (only 2.17 KiB gzipped after bundling)
- No external dependencies

## Installation

Install from `npm` using your favorite package manager:

```
npm install @cdandrea/memoize-ts
```

```
yarn add @cdandrea/memoize-ts
```

```
pnpm install @cdandrea/memoize-ts
```

## Usage

Simply supply the function to be memoized as the 1st parameter of the `memoize()` HOF. In the example below a recursive function that calculates the Fibonacci sequence is supplied and its memoized version is assigned to the `fibonacci` variable. The memoized function can then be used in the same way as if it were not memoized.

```ts
import { memoize } from '@cdandrea/memoize-ts'

const fibonacci = memoize(
  (n: number): number => (
    console.log(`Calculating fibonacci(${n})`),
    n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2)
  ),
)

console.log(fibonacci(40))
```

Notice that the memoized function returned by `memoize()` gets fully typed, keeping the original function's signature (same parameters and return value), no matter the number or type of the parameters, up to the documented limit (currently 30).

## Supporting recursive functions

Notice that the following **WON'T** work as expected:

```ts
// Standard Fibonacci function, without any memoization.
const fibonacci = (n: number): number => (
  console.log(`Calculating fibonacci(${n})`),
  n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2)
)

// Now its memoized version.
const memoFibonacci = memoize(fibonacci)

// This call won't fully use memoization.
console.log(memoFibonacci(40))
```

This is due to the fact that the 2 recursive calls to `fibonacci()` inside the standard function body will still call the original/non-memoized function, even it the 1st call was made to the memoized version, `memoFibonacci()`.

So, the proper way to handle recursive functions is to define the function only once and pass it as a parameter to the `memoize()` HOF:

```ts
const fibonacci = memoize(
  (n: number): number => (
    console.log(`Calculating fibonacci(${n})`),
    n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2)
  ),
)

console.log(fibonacci(40))
```

The following example is very uncommon (have you ever declared a function with `let`, not `const`?), but would work perfectly well:

```ts
let fibonacci = (n: number): number => (
  console.log(`Calculating fibonacci(${n})`),
  n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2)
)

fibonacci = memoize(fibonacci)

console.log(fibonacci(40))
```

So, if you happen to have a recursive function imported from some external library, normally declared with `const`, and wish to memoize it, I must say that **you are out of luck, pal** 🤣🤣🤣.

## Optional custom parameter-comparison callback function

The `memoize()` HOF needs a way to check if an entry (combination of parameters) is already cached and for that is uses a highly generic, efficient and powerful default comparison callback function.

Its default behavior is to compare each value individually with the standand `===` JS/TS's strict-equals operator, which basically deals with all primitive types, but the function also takes care of collection-like structures such as **objects**, **maps** (with all kinds of keys) and **arrays**, of any depth. And you can freely and safely mix them all.

**Classes** (in fact, class instances), **regular expressions**, **dates** and even **functions** are covered, too.

**Circular data structures** are now fully supported (so there is no risk of the dreaded "Stack Overflow" error).

All the following return `true`:

```ts
compareValues([1, 2, 3], [1, 2, 3])

// Objects (keys) order doesn't matter.
compareValues({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3 })
compareValues({ x: 1, y: 2, z: 3 }, { y: 2, z: 3, x: 1 })

compareValues(
  [
    1,
    'abc',
    false,
    /xyz/,
    new Date(2024, 7, 12),
    (n: number) => -n,
    undefined,
    null,
    [10, 20, 30],
    { x: 1, y: 2, z: 3 },
    // Maps with unusual keys.
    new Map([
      // string[] key
      [['a', 'b', 'c'], 1],
      // boolean key
      [true, 2],
      // object key, with values of types number, number[] and null
      [{ x: 0, y: [1, 2, 3], z: null }, 3],
    ]),
  ],
  [
    1,
    'abc',
    false,
    /xyz/,
    new Date(2024, 7, 12),
    (n: number) => -n,
    undefined,
    null,
    [10, 20, 30],
    { x: 1, y: 2, z: 3 },
    new Map([
      [['a', 'b', 'c'], 1],
      [true, 2],
      [{ x: 0, y: [1, 2, 3], z: null }, 3],
    ]),
  ],
)

// Arrays x Objects which behave as arrays.
compareValues([10, 20, 30, 40, 50], { 0: 10, 1: 20, 2: 30, 3: 40, 4: 50 })
```

While these return `false`:

```ts
// Right array is shorter than the left one.
compareValues([1, 2, 3], [1, 2])

// false ≠ true in 3rd position.
compareValues([1, 'abc', false], [1, 'abc', true])

// 3 ≠ 4 in z's value.
compareValues({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 4 })

// Right object has more keys than the left one.
compareValues({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3, w: 4 })

// Right object has fewer keys than the left one.
compareValues({ x: 1, y: 2, z: 3 }, { x: 1, y: 2 })

// Right object z's value is longer than left's one.
compareValues({ x: 1, y: 2, z: [1, 2, 3] }, { x: 1, y: 2, z: [1, 2, 3, 4] })

// Different maps (key) order.
compareValues(
  new Map([
    ['x', 1],
    ['y', 2],
    ['z', 3],
  ]),
  new Map([
    ['y', 2],
    ['z', 3],
    ['x', 1],
  ]),
)
```

The good news is that the above function, `compareValues()`, is also exported from the package and can be used in your project if needed, even if the use has nothing to do with memoization itself:

```ts
import { compareValues } from '@cdandrea/memoize-ts'
```

However, if a different comparison behavior is necessary you can provide a custom version as the second parameter of the `memoize()` HOF, following the callback function signature below:

```ts
comparisonFn(
  leftArgs: [p1: P1, p2: P2, … pn: Pn],
  rightArgs: [p1: P1, p2: P2, … pn: Pn]
) => boolean
```

- `leftArgs: [p1: P1, p2: P2, … pn: Pn]`: tuple containing all "left" arguments
- `rightArgs: [p1: P1, p2: P2, … pn: Pn]`: tuple containing all "right" arguments

PS: Choose whatever names you like for the callback function's parameters.

Notice that both tuples have exactly the same types as the original function's arguments. This means the types `P1, P2, … Pn` are always automatically inferred by TS.

The example below provides a custom comparison callback function that:

- for the 1st parameters, `leftP1` and `rightP1`, of type `number[]`, considers only their size, ignoring their contents
- for the 2nd ones, `leftP2` and `rightP2`, of type `string`, ignores their case, so 'abc' is equivalent to 'ABC'
- for the 3rd ones, `leftP3` and `rightP3`, of type `Record<string, number>`, considers their JSON (string) representation, taking care of the fact that in JS/TS `{ x: 1 } ≠ { x: 1 }`

```ts
const fn = memoize(
  (p1: number[], p2: string, p3: Record<string, number>) => Math.random(),
  (left, right) => {
    const [leftP1, leftP2, leftP3] = left
    const [rightP1, rightP2, rightP3] = right

    return (
      leftP1.length === rightP1.length &&
      leftP2.toUpperCase() === rightP2.toUpperCase() &&
      JSON.stringify(leftP3) === JSON.stringify(rightP3)
    )
  },
)

// Creates a new (first) cache entry.
console.log(fn([1, 2, 3], 'abc', { x: 1 }))

// Does a "cache hit" from the previous call.
console.log(fn([3, 2, 1], 'ABC', { x: 1 }))

// Another "cache hit".
console.log(fn([1, 3, 5], 'aBc', { x: 1 }))

// Creates a new (second) cache entry.
console.log(fn([0, 1], '', { x: 2 }))
```

#### 💡 Pro Tip: Ignoring 1 or more parameters

If, for some particular reason, you do not want to consider all parameters when looking for a cached entry, just provide a custom parameter-comparison callback function, receiving as usual both `left` and `right` parameters, and then call the `compareValues()` default callback function with only the tuple items (which represent the memoized function's parameters) you want to consume. For example:

```ts
const fn = memoize(
  (p1: number[], p2: string, p3: Record<string, number>) => Math.random(),
  (left, right) => {
    const [leftP1, _leftP2, leftP3] = left
    const [rightP1, _rightP2, rightP3] = right

    return compareValues([leftP1, leftP3], [rightP1, rightP3])
  },
)
```

In the example above we have intentionally ignored the second parameter, `p2` (represented by `_leftP2` and `_rightP2` inside the custom callback function).

## Managing the internal cache

You can inspect and clear the cache using the following methods:

- `getCache()`: returns the internal cache (currently implemented as an array), used primarily for inspection/debugging purposes.
- `clearAll()`: purges the entire cache.
- `clearEntry(p1: P1, p2: P2, … pn: Pn)`: purges an specific entry, based on the arguments `p1, p2, … pn`, applied to the supplied custom parameter-comparison callback function, if any, or the default one. As usual, the types `P1, P2, … Pn` are always automatically inferred by TS.

The example below makes use of these methods:

```ts
const factorial = memoize(
  (n: number): number => (
    console.log(`Calculating ${n}!`), n <= 1 ? 1 : n * factorial(n - 1)
  ),
)

console.log('Current cache: ', JSON.stringify(factorial.getCache()))

factorial.clearAll()

// This method expects a `number`, just like the original `factorial()` function.
factorial.clearEntry(5)
```

## Optional parameters

The current implementation does not support optional parameters (with or without default values), due to the way TS's function overloading works.

A simple solution is to pack all parameters either in a plain object or a tuple, and pass them as a **single** parameter, allowing TS to infer all types (including the optional ones) correctly.

This **WON'T** work:

```ts
const fn = memoize(
  (p1: number[], p2: string, p3: Record<string, number>, p4 = false) =>
    Math.random(),
  (
    [leftP1, leftP2, leftP3, leftP4 = false],
    [rightP1, rightP2, rightP3, rightP4 = false],
  ) =>
    leftP1.length === rightP1.length &&
    leftP2.toUpperCase() === rightP2.toUpperCase() &&
    JSON.stringify(leftP3) === JSON.stringify(rightP3) &&
    leftP4 === rightP4,
)
```

However, with the suggested packing, this **WILL** work as expected.

Using an object:

```ts
type FnParametersPackedAsObjectType = {
  p1: number[]
  p2: string
  p3: Record<string, number>
  p4?: boolean
}

const fn = memoize(
  ({ p1, p2, p3, p4 = false }: HParametersPackedAsObjectType) => Math.random(),
  (
    [{ p1: leftP1, p2: leftP2, p3: leftP3, p4: leftP4 = false }],
    [{ p1: rightP1, p2: rightP2, p3: rightP3, p4: rightP4 = false }],
  ) =>
    leftP1.length === rightP1.length &&
    leftP2.toUpperCase() === rightP2.toUpperCase() &&
    JSON.stringify(leftP3) === JSON.stringify(rightP3) &&
    leftP4 === rightP4,
)
```

Or a tuple:

```ts
type FnParametersPackedAsTupleType = [
  p1: number[],
  p2: string,
  p3: Record<string, number>,
  p4?: boolean,
]

const fn = memoize(
  ([p1, p2, p3, p4 = false]: HParametersPackedAsTupleType) => Math.random(),
  (
    [[leftP1, leftP2, leftP3, leftP4 = false]],
    [[rightP1, rightP2, rightP3, rightP4 = false]],
  ) =>
    leftP1.length === rightP1.length &&
    leftP2.toUpperCase() === rightP2.toUpperCase() &&
    JSON.stringify(leftP3) === JSON.stringify(rightP3) &&
    leftP4 === rightP4,
)
```

## 🙌 Credits

This library was inspired by ideas from these relevant contributors:

- [Rahul M. Juliato](https://github.com/LionyxML): provided essential information on how to publish npm packages and integrate with VS Code; also suggested the implementation of cache management methods
- [Rodrigo Navarro](https://github.com/reu): suggested the inclusion of a custom parameter-comparison callback function, allowing for greater flexibility in the library; also suggested the use of the TS's function overloading mechanism in order to achieve proper function signature inference
- [Amanda F. Iaquinta](https://github.com/AmandaFI): helped to improve the documentation with valuable suggestions and additions
