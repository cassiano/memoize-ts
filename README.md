# `memoize()` function written in TypeScript

## Features include:

- 100% type-safe
- Supports functions up to 100 parameters (but more can be easily added, if ever needed)
- Adds methods for clearing the entire cache or even particular entries
- Allows for custom parameter comparison functions (defaulting to comparing each parameter individually, using the standand `===` JS/TS strict-equals operator)

## Pre-requisites:

You must install Deno (https://docs.deno.com/runtime/manual/getting_started/installation) before running tests.

## To run tests:

```
✗ deno test test.ts
```

## Known limitations:

- The current implementation does not support optional parameters, due to the way TypeScript's function overloading works. A possible workaround is shown below:

This DOES NOT work:

```ts
const h = memoize(
  (_p1: number[], _p2: string, _p3: Record<string, number>, p4 = false) => Math.random(),
  ([leftP1, leftP2, leftP3, leftP4], [rightP1, rightP2, rightP3, rightP4]) =>
    leftP1.length === rightP1.length &&
    leftP2.toUpperCase() === rightP2.toUpperCase() &&
    JSON.stringify(leftP3) === JSON.stringify(rightP3) &&
    leftP4 === rightP4
)
```

However, this will work as expected:

```ts
const p4DefaultValue = false

const h = memoize(
  (_p1: number[], _p2: string, _p3: Record<string, number>, p4: boolean | undefined) => (
    (p4 ??= p4DefaultValue), Math.random()
  ),
  (
    [leftP1, leftP2, leftP3, leftP4 = p4DefaultValue],
    [rightP1, rightP2, rightP3, rightP4 = p4DefaultValue]
  ) =>
    leftP1.length === rightP1.length &&
    leftP2.toUpperCase() === rightP2.toUpperCase() &&
    JSON.stringify(leftP3) === JSON.stringify(rightP3) &&
    leftP4 === rightP4
)
```

### Basic usage (notice how the memoized function gets properly typed):

```ts
const fibonacci = memoize(
  (n: number): number => (
    console.log(`Calculating fibonacci(${n})`), n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2)
  )
)

console.log(fibonacci(0))
console.log(fibonacci(1))
console.log(fibonacci(2))
console.log(fibonacci(3))
console.log(fibonacci(4))
console.log(fibonacci(5))
console.log(fibonacci(6))
console.log(fibonacci(40))
```

### Managing the internal cache:

```ts
const factorial = memoize(
  (n: number): number => (console.log(`Calculating ${n}!`), n <= 1 ? 1 : n * factorial(n - 1))
)

console.log(factorial(6))
console.log(factorial(6))
console.log(factorial(6))
console.log('Current cache: ', JSON.stringify(factorial.getCache()))

console.log('Clearing all...')
factorial.clearAll()
console.log('Cache: ', JSON.stringify(factorial.getCache()))

console.log(factorial(6))

console.log('Clearing entry 5...')
factorial.clearEntry(5)
console.log('Current cache: ', JSON.stringify(factorial.getCache()))
console.log(factorial(5))
console.log(factorial(5))
```

### Specifying an optional parameter-comparison function (notice how all callback parameters get properly typed as well):

```ts
const f = memoize(
  (_p1: number[], _p2: string, _p3: Record<string, number>) => Math.random(),
  ([leftP1, leftP2, leftP3], [rightP1, rightP2, rightP3]) =>
    leftP1.length === rightP1.length &&
    leftP2.toUpperCase() === rightP2.toUpperCase() &&
    JSON.stringify(leftP3) === JSON.stringify(rightP3)
)

console.log(f([1, 2, 3], 'abc', { x: 1 }))
console.log(f([3, 2, 1], 'ABC', { x: 1 }))
console.log(f([1, 3, 5], 'aBc', { x: 1 }))
console.log(f([0, 1], '', { x: 2 }))
```
