# 100% type-safe `memoize()` function written in TypeScript (TS)

## Features include:

- 100% type-safe
- Supports functions up to 30 parameters (but more can be easily added, if ever needed)
- Adds methods for inspecting the cache, clearing it entirely or only particular entries
- Allows for an optional custom parameter-comparison function, which defaults to compare each parameter individually
  with JS's standand strict-equals operator (`===`), taking care of objects and arrays (or any combination of them) of any depth

## Pre-requisites:

None.

## Basic usage:

Simply supply the function to be memoized as the 1st parameter of the HOF (Higher-Order Function) `memoize()`. Recursive
functions are fully supported (please see example below).

Notice that the memoized function returned by `memoize()` gets fully typed, keeping the original function's signature (same
parameters and return value), no matter the number or type of the parameters, up to the documented limit (currently 30).

```ts
const fibonacci = memoize(
  (n: number): number => (
    console.log(`Calculating fibonacci(${n})`),
    n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2)
  ),
)

console.log(fibonacci(40))
```

## Specifying an optional parameter-comparison function:

A function callback with the following signature:

```ts
comparisonFn(leftArgs: [p1: P1, p2: P2, ... pn: Pn], rightArgs: [p1: P1, p2: P2, ... pn: Pn]) => boolean
```

can be optionally supplied as the 2nd parameter of the HOF `memoize()`, with 2 parameters:

- `leftArgs: [p1: P1, p2: P2, ... pn: Pn]`: tuple containging all "left" arguments
- `rightArgs: [p1: P1, p2: P2, ... pn: Pn]`: tuple containging all "right" arguments

(pick whatever names you like for the callback's parameters)

Notice that both tuples have exactly the same types as the original function's arguments. This means the types `P1, P2, ... Pn` are
always automatically inferred by TS.

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

## Methods provided for managing the internal cache:

- `getCache()`: returns the internal cache (currently implemented as an array), used primarily for inspection/debugging purposes
- `clearAll()`: purges the entire cache
- `clearEntry(p1: P1, p2: P2, ... pn: Pn)`: purges an specific entry, based on the arguments `p1, p2, ... pn`, applied to the
  supplied custom parameter-comparison function, if any, or the default one. As usual, the types `P1, P2, ... Pn` are always
  automatically inferred by TS.

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

## Known limitations:

- The current implementation does not support optional parameters (with or without default values), due to the way TS's
  function overloading works. A simple solution is to pack all parameters either in a plain object or a tuple, and pass them as a
  _single_ parameter, allowing TS to infer all types (including the optional ones) correctly.

This will not work:

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

However, with the suggested packing, this will work as expected:

```ts
// Using an object:

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

// Or a tuple:

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
