import { assertEquals, assertNotEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts'
import { memoize, compareValues } from '../src/memoize.ts'

Deno.test('Comparing values', () => {
  // `undefined` and `null` combined.
  assertEquals(compareValues(undefined, undefined), true)
  assertEquals(compareValues(undefined, null), false)
  assertEquals(compareValues(null, undefined), false)
  assertEquals(compareValues(null, null), true)

  // `undefined` compared to other types.
  assertEquals(compareValues(undefined, 1), false)
  assertEquals(compareValues(undefined, '...'), false)
  assertEquals(compareValues(undefined, true), false)
  assertEquals(compareValues(undefined, []), false)
  assertEquals(compareValues(undefined, {}), false)

  // `null` compared to other types.
  assertEquals(compareValues(null, 1), false)
  assertEquals(compareValues(null, '...'), false)
  assertEquals(compareValues(null, true), false)
  assertEquals(compareValues(null, []), false)
  assertEquals(compareValues(null, {}), false)

  // Different types. No need for this test, since it is flagged by TS at compile-time.
  // assertEquals(valuesEqual(1, '1'), false)

  // Arrays.
  assertEquals(compareValues([], []), true)
  assertEquals(compareValues([1], [1]), true)
  assertEquals(compareValues([1, 2], [1, 2]), true)
  assertEquals(compareValues([1, 2, 3], [1, 2, 3]), true)
  assertEquals(compareValues([1, 2, 3, [4, [5, [6]]]], [1, 2, 3, [4, [5, [6]]]]), true)
  assertEquals(compareValues([1, 2, 3], [1, 2]), false) // `left` having more elements than `right`.
  assertEquals(compareValues([1, 2, 3], [1, 2, 3, 4]), false) // `left` having less elements than `right`.

  // Objects.
  assertEquals(compareValues({}, {}), true)
  assertEquals(compareValues({ x: 1 }, { x: 1 }), true)
  assertEquals(compareValues({ x: 1, y: 2, z: 3 }, { z: 3, x: 1, y: 2 }), true) // Different order.
  assertEquals(compareValues({ x: 1, y: 2, z: 3 }, { x: 1, y: 2 }), false) // `left` having more key+value pairs than `right`.
  assertEquals(compareValues({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3, w: 4 }), false) // `left` having less key+value pairs than `right`.
  assertEquals(
    compareValues({ x: 1, y: 2, z: [1, 2, 3, [4, [5, [6]]]] }, { z: [1, 2, 3, [4, [5, [6]]]], x: 1, y: 2 }),
    true
  )

  // Objects with array elements.
  assertEquals(compareValues({ x: [1, 2, 3], y: 4 }, { x: [1, 2, 3], y: 4 }), true)

  // Arrays with object elements.
  assertEquals(compareValues([1, 2, { x: [3, 4, 5], y: 6 }], [1, 2, { y: 6, x: [3, 4, 5] }]), true)

  // Arrays x objects with sequencial integer (natural, ≥ 0) indexes.
  assertEquals(compareValues([10, 20, 30, 40, 50], { 0: 10, 1: 20, 2: 30, 3: 40, 4: 50 }), true)
  assertEquals(compareValues([10, 20, 30, 40, 50], { 4: 50, 3: 40, 2: 30, 1: 20, 0: 10 }), true) // Different key order.

  // Classes.

  class C {
    constructor(public a: number, public b: string) {}
  }

  class D {
    constructor(public c: C, public d: boolean[]) {}
  }

  const d1 = new D(new C(1, '...'), [true, false, true])
  const d2 = new D(new C(1, '...'), [true, false, true])
  const d3 = new D(new C(1, '...'), [false, true, false])
  const d4 = new D(new C(2, '...'), [true, false, true])
  const d5 = new D(new C(1, '.'), [true, false, true])

  assertEquals(compareValues(d1, d2), true)
  assertEquals(compareValues(d2, d1), true)
  assertEquals(compareValues(d1, d1), true)
  assertEquals(compareValues(d1, d3), false)
  assertEquals(compareValues(d3, d1), false)
  assertEquals(compareValues(d1, d4), false)
  assertEquals(compareValues(d4, d1), false)
  assertEquals(compareValues(d1, d5), false)
  assertEquals(compareValues(d5, d1), false)
})

Deno.test('Memoizing 0 parameters functions', () => {
  const e = memoize(() => Math.random())
  const memoizedValue = e()

  assertEquals(e(), memoizedValue) // Assures read memoized value.
  assertEquals(e(), memoizedValue) // Assures read memoized value.
  assertEquals(e(), memoizedValue) // Assures read memoized value.
})

Deno.test('Memoizing 1 parameter functions', () => {
  const e = memoize((a: number) => a + Math.random())
  const memoizedValue1 = e(1)
  const memoizedValue2 = e(2)

  assertNotEquals(memoizedValue1, memoizedValue2)

  assertEquals(e(1), memoizedValue1) // Assures read memoized value.
  assertEquals(e(1), memoizedValue1) // Assures read memoized value.
  assertEquals(e(1), memoizedValue1) // Assures read memoized value.

  assertEquals(e(2), memoizedValue2) // Assures read memoized value.
  assertEquals(e(2), memoizedValue2) // Assures read memoized value.
  assertEquals(e(2), memoizedValue2) // Assures read memoized value.
})

Deno.test('Memoizing factorial() function', () => {
  let calculations = 0

  const factorial = memoize(
    (n: number): number => (calculations++, n <= 1 ? 1 : n * factorial(n - 1)),
    ([a], [b]) => a === b
  )

  assertEquals(calculations, 0)

  factorial(10)
  assertEquals(calculations, 10)

  factorial(10)
  assertEquals(calculations, 10) // Assures no further calculations were needed.

  factorial(10)
  assertEquals(calculations, 10) // Assures no further calculations were needed.

  factorial(9)
  assertEquals(calculations, 10) // Assures no further calculations were needed.

  factorial(8)
  assertEquals(calculations, 10) // Assures no further calculations were needed.

  factorial(11)
  assertEquals(calculations, 11)

  factorial(11)
  assertEquals(calculations, 11) // Assures no further calculations were needed.
})

Deno.test('Memoizing fibonacci() function', () => {
  let calculations = 0

  const fibonacci = memoize(
    (n: number): number => (calculations++, n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2))
  )

  assertEquals(calculations, 0)

  fibonacci(0)
  assertEquals(calculations, 1)

  fibonacci(1)
  assertEquals(calculations, 2)

  fibonacci(2)
  assertEquals(calculations, 3)

  fibonacci(3)
  assertEquals(calculations, 4)

  fibonacci(4)
  assertEquals(calculations, 5)

  fibonacci(4)
  assertEquals(calculations, 5) // Assures no further calculations were needed.

  fibonacci(3)
  assertEquals(calculations, 5) // Assures no further calculations were needed.

  fibonacci(2)
  assertEquals(calculations, 5) // Assures no further calculations were needed.

  fibonacci(1)
  assertEquals(calculations, 5) // Assures no further calculations were needed.

  fibonacci(0)
  assertEquals(calculations, 5) // Assures no further calculations were needed.
})

Deno.test('Memoizing knapsack() function, using a single object parameter', () => {
  type KnapsackArgsType = {
    n: number
    w: number
    profits: number[]
    weights: number[]
  }

  let calculations = 0

  const knapsack = memoize(({ n, w, profits, weights }: KnapsackArgsType): number => {
    calculations++

    if (n === 0 || w === 0) return 0 // Base case.

    return Math.max(
      weights[n - 1] <= w
        ? knapsack({ n: n - 1, w: w - weights[n - 1], profits, weights }) + profits[n - 1]
        : 0,
      knapsack({ n: n - 1, w, profits, weights })
    )
  })

  assertEquals(calculations, 0)

  knapsack({ n: 3, w: 2, profits: [10, 20, 0], weights: [1, 1, 1] })
  assertEquals(calculations, 9)

  knapsack({ n: 3, w: 2, profits: [10, 20, 0], weights: [1, 1, 1] })
  assertEquals(calculations, 9) // Assures no further calculations were needed.

  knapsack({ n: 3, w: 2, profits: [10, 20, 0], weights: [1, 1, 1] })
  assertEquals(calculations, 9) // Assures no further calculations were needed.

  knapsack({ n: 4, w: 2, profits: [10, 20, 0], weights: [1, 1, 1] })
  assertEquals(calculations, 10)

  knapsack({ n: 4, w: 2, profits: [10, 20, 0], weights: [1, 1, 1] })
  assertEquals(calculations, 10) // Assures no further calculations were needed.

  knapsack({ n: 4, w: 2, profits: [10, 20, 0], weights: [1, 1, 1] })
  assertEquals(calculations, 10) // Assures no further calculations were needed.
})

Deno.test('Memoizing knapsack() function, using a single tuple parameter', () => {
  type KnapsackArgsType = [n: number, w: number, profits: number[], weights: number[]]

  let calculations = 0

  const knapsack = memoize(([n, w, profits, weights]: KnapsackArgsType): number => {
    calculations++

    if (n === 0 || w === 0) return 0 // Base case.

    return Math.max(
      weights[n - 1] <= w ? knapsack([n - 1, w - weights[n - 1], profits, weights]) + profits[n - 1] : 0,
      knapsack([n - 1, w, profits, weights])
    )
  })

  assertEquals(calculations, 0)

  knapsack([3, 2, [10, 20, 0], [1, 1, 1]])
  assertEquals(calculations, 9)

  knapsack([3, 2, [10, 20, 0], [1, 1, 1]])
  assertEquals(calculations, 9) // Assures no further calculations were needed.

  knapsack([3, 2, [10, 20, 0], [1, 1, 1]])
  assertEquals(calculations, 9) // Assures no further calculations were needed.

  knapsack([4, 2, [10, 20, 0], [1, 1, 1]])
  assertEquals(calculations, 10)

  knapsack([4, 2, [10, 20, 0], [1, 1, 1]])
  assertEquals(calculations, 10) // Assures no further calculations were needed.

  knapsack([4, 2, [10, 20, 0], [1, 1, 1]])
  assertEquals(calculations, 10) // Assures no further calculations were needed.
})
