# 100% type-safe `memoize()` function written in TS

> [Memoization](https://en.wikipedia.org/wiki/Memoization) is an optimization technique that makes applications and functions more efficient by storing the results of function calls in a cache and returning the cached results when the same inputs occur, instead of computing it again. This package provides a simple way to transform functions into their memoized versions using a Higher-Order Function (HOF) called "memoize()", while keeping the original function's signature.

## Features

- 100% type-safe
- Supports functions that have up to 30 parameters
- Supports recursive functions
- Provides methods for [managing the cache](#managingCache)
- Provides a default function for searching entries in the cache, while supporting [custom parameter-comparison functions](#customFunction)
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

The following example is not so common (have you ever declared a function with `let`, not `const`?), but **WILL** work as well:

```ts
let fibonacci = (n: number): number => (
  console.log(`Calculating fibonacci(${n})`),
  n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2)
)

fibonacci = memoize(fibonacci)

console.log(fibonacci(40))
```

So, if you have a recursive function imported from some external library, normally declared with `const`, and wish to memoize it, unfortunately it won't be possible with this package.

## Optional custom parameter-comparison function<a name="customFunction"></a>

The `memoize()` HOF needs a way to check if an entry (combination of parameters) is already cached and for that is uses a comparison function. The default behavior of the comparison function is to compare each parameter individually with the standand `===` JS's strict-equals operator, taking care of objects and arrays of any depth.

##### All the following return `true`:

```ts
compareValues([1, 2, 3], [1, 2, 3])
compareValues([1, '...', false], [1, '...', false])
compareValues({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3 })
compareValues({ x: 1, y: 2, z: [1, 2, 3] }, { x: 1, y: 2, z: [1, 2, 3] })
```

##### While these return `false`:

```ts
compareValues([1, 2, 3], [1, 2])
compareValues([1, '...', false], [1, '...', true])
compareValues({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 4 })
compareValues({ x: 1, y: 2, z: [1, 2, 3] }, { x: 1, y: 2, z: [1, 2] })
```

(the good news is that the above function, `compareValues()`, is also exported from the package and can also be used in your
project if needed, even if the use has nothing to do with `memoization` itself)

However, if a different comparison behavior is necessary you can provide a custom version as the second parameter of the `memoize()` HOF, following the function callback signature below:

```ts
comparisonFn(leftArgs: [p1: P1, p2: P2, ... pn: Pn], rightArgs: [p1: P1, p2: P2, ... pn: Pn]) => boolean
```

- `leftArgs: [p1: P1, p2: P2, ... pn: Pn]`: tuple containing all "left" arguments
- `rightArgs: [p1: P1, p2: P2, ... pn: Pn]`: tuple containing all "right" arguments

Obs: Choose whatever names you like for the callback's parameters.

Notice that both tuples have exactly the same types as the original function's arguments. This means the types `P1, P2, ... Pn` are always automatically inferred by TS.

The example below provides a custom comparison function that:

- for the 1st parameters, `leftP1` and `rightP1`, of type `number[]`, considers only their size, ignoring their contents
- for the 2nd ones, `leftP2` and `rightP2`, of type `string`, ignores their case, so 'abc' is equivalent to 'ABC'
- for the 3rd ones, `leftP3` and `rightP3`, of type `Record<string, number>`, considers their JSON (string) representation, taking care of the fact that in JS/TS `{ x: 1 } === { x: 1 }` generally returns `false`

```ts
const f = memoize(
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

console.log(f([1, 2, 3], 'abc', { x: 1 })) // Creates a new (first) cache entry.
console.log(f([3, 2, 1], 'ABC', { x: 1 })) // Does a "cache hit" from the previous call.
console.log(f([1, 3, 5], 'aBc', { x: 1 })) // Another "cache hit".
console.log(f([0, 1], '', { x: 2 })) // Creates a new (second) cache entry.
```

## Managing the internal cache<a name="managingCache"></a>

You can inspect and clear the cache using the following methods:

- `getCache()`: returns the internal cache (currently implemented as an array), used primarily for inspection/debugging purposes.
- `clearAll()`: purges the entire cache.
- `clearEntry(p1: P1, p2: P2, ... pn: Pn)`: purges an specific entry, based on the arguments `p1, p2, ... pn`, applied to the supplied custom parameter-comparison function, if any, or the default one. As usual, the types `P1, P2, ... Pn` are always automatically inferred by TS.

The example below makes use of these methods:

```ts
const factorial = memoize(
  (n: number): number => (
    console.log(`Calculating ${n}!`), n <= 1 ? 1 : n * factorial(n - 1)
  ),
)

console.log('Current cache: ', JSON.stringify(factorial.getCache()))
factorial.clearAll()
factorial.clearEntry(5) // This method expects a `number`, just like the original `factorial` function.
```

## Optional parameters

- The current implementation does not support optional parameters (with or without default values), due to the way TS's function overloading works. A simple solution is to pack all parameters either in a plain object or a tuple, and pass them as a
  **single** parameter, allowing TS to infer all types (including the optional ones) correctly.

This **WON'T** work:

```ts
const h = memoize(
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

However, with the suggested packing, this **WILL** work as expected:

##### Using an object:

```ts
type HParametersPackedAsObjectType = {
  p1: number[]
  p2: string
  p3: Record<string, number>
  p4?: boolean
}

const h = memoize(
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

##### Or a tuple:

```ts
type HParametersPackedAsTupleType = [
  p1: number[],
  p2: string,
  p3: Record<string, number>,
  p4?: boolean,
]

const h = memoize(
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
