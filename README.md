# 100% type-safe `memoize()` function written in TypeScript

## Features include:

- 100% type-safe
- Supports functions up to 30 parameters (but more can be easily added, if ever needed)
- Adds methods for clearing the entire cache or even particular entries
- Allows for custom parameter comparison functions (defaulting to comparing each parameter individually, using the standand `===` JS/TS strict-equals operator)

## Pre-requisites:

None.

### Basic usage (notice that the memoized function gets properly typed):

```ts
const fibonacci = memoize(
  (n: number): number => (
    console.log(`Calculating fibonacci(${n})`), n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2)
  )
)

console.log(fibonacci(40))
```

### Managing the internal cache:

```ts
const factorial = memoize(
  (n: number): number => (console.log(`Calculating ${n}!`), n <= 1 ? 1 : n * factorial(n - 1))
)

console.log('Current cache: ', JSON.stringify(factorial.getCache()))
factorial.clearAll()
factorial.clearEntry(5)
```

### Specifying an optional parameter-comparison function (notice that all callback parameters get properly typed as well):

```ts
const f = memoize(
  (p1: number[], p2: string, p3: Record<string, number>) => Math.random(),
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

## Known limitations:

- The current implementation does not support optional parameters, due to the way TypeScript's function overloading works. A simple solution is to pack all parameters either in a plain object or a tuple,
  passed as a _single_ parameter:

This will not work:

```ts
const h = memoize(
  (p1: number[], p2: string, p3: Record<string, number>, p4 = false) => Math.random(),
  ([leftP1, leftP2, leftP3, leftP4 = false], [rightP1, rightP2, rightP3, rightP4 = false]) =>
    leftP1.length === rightP1.length &&
    leftP2.toUpperCase() === rightP2.toUpperCase() &&
    JSON.stringify(leftP3) === JSON.stringify(rightP3) &&
    leftP4 === rightP4
)
```

However, with the suggested packing, this will work as expected:

```ts
// Using an object:

type HParametersType = {
  p1: number[]
  p2: string
  p3: Record<string, number>
  p4?: boolean
}

const h = memoize(
  ({ p1, p2, p3, p4 = false }: HParametersType) => Math.random(),
  (
    [{ p1: leftP1, p2: leftP2, p3: leftP3, p4: leftP4 = false }],
    [{ p1: rightP1, p2: rightP2, p3: rightP3, p4: rightP4 = false }]
  ) =>
    leftP1.length === rightP1.length &&
    leftP2.toUpperCase() === rightP2.toUpperCase() &&
    JSON.stringify(leftP3) === JSON.stringify(rightP3) &&
    leftP4 === rightP4
)

// Or a tuple:

type HParametersType = [p1: number[], p2: string, p3: Record<string, number>, p4?: boolean]

const h = memoize(
  ([p1, p2, p3, p4 = false]: HParametersType) => Math.random(),
  ([[leftP1, leftP2, leftP3, leftP4 = false]], [[rightP1, rightP2, rightP3, rightP4 = false]]) =>
    leftP1.length === rightP1.length &&
    leftP2.toUpperCase() === rightP2.toUpperCase() &&
    JSON.stringify(leftP3) === JSON.stringify(rightP3) &&
    leftP4 === rightP4
)
```
