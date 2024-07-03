import { assertEquals, assertNotEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts'
import { memoize, valuesEqual } from './memoize.ts'

Deno.test('Comparing values', () => {
  // `undefined` and `null` combined.
  assertEquals(valuesEqual(undefined, undefined), true)
  assertEquals(valuesEqual(undefined, null), false)
  assertEquals(valuesEqual(null, undefined), false)
  assertEquals(valuesEqual(null, null), true)

  // `undefined` compared to other types.
  assertEquals(valuesEqual(undefined, 1), false)
  assertEquals(valuesEqual(undefined, '...'), false)
  assertEquals(valuesEqual(undefined, true), false)
  assertEquals(valuesEqual(undefined, []), false)
  assertEquals(valuesEqual(undefined, {}), false)

  // `null` compared to other types.
  assertEquals(valuesEqual(null, 1), false)
  assertEquals(valuesEqual(null, '...'), false)
  assertEquals(valuesEqual(null, true), false)
  assertEquals(valuesEqual(null, []), false)
  assertEquals(valuesEqual(null, {}), false)

  // Different types.
  assertEquals(valuesEqual(1, '1'), false)

  // Arrays.
  assertEquals(valuesEqual([], []), true)
  assertEquals(valuesEqual([1], [1]), true)
  assertEquals(valuesEqual([1, 2], [1, 2]), true)
  assertEquals(valuesEqual([1, 2, 3], [1, 2, 3]), true)
  assertEquals(valuesEqual([1, 2, 3, [4, [5, [6]]]], [1, 2, 3, [4, [5, [6]]]]), true)
  assertEquals(valuesEqual([1, 2, 3], [1, 2]), false) // `left` having more elements than `right`.
  assertEquals(valuesEqual([1, 2, 3], [1, 2, 3, 4]), false) // `left` having less elements than `right`.

  // Objects.
  assertEquals(valuesEqual({}, {}), true)
  assertEquals(valuesEqual({ x: 1 }, { x: 1 }), true)
  assertEquals(valuesEqual({ x: 1, y: 2, z: 3 }, { z: 3, x: 1, y: 2 }), true) // Different order.
  assertEquals(valuesEqual({ x: 1, y: 2, z: 3 }, { x: 1, y: 2 }), false) // `left` having more key+value pairs than `right`.
  assertEquals(valuesEqual({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3, w: 4 }), false) // `left` having less key+value pairs than `right`.
  assertEquals(
    valuesEqual({ x: 1, y: 2, z: [1, 2, 3, [4, [5, [6]]]] }, { z: [1, 2, 3, [4, [5, [6]]]], x: 1, y: 2 }),
    true
  )
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
  assertEquals(calculations, 10) // Assures no further calculations/calls were needed.

  factorial(10)
  assertEquals(calculations, 10) // Assures no further calculations/calls were needed.

  factorial(9)
  assertEquals(calculations, 10) // Assures no further calculations/calls were needed.

  factorial(8)
  assertEquals(calculations, 10) // Assures no further calculations/calls were needed.

  factorial(11)
  assertEquals(calculations, 11)

  factorial(11)
  assertEquals(calculations, 11) // Assures no further calculations/calls were needed.
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
  assertEquals(calculations, 5) // Assures no further calculations/calls were needed.

  fibonacci(3)
  assertEquals(calculations, 5) // Assures no further calculations/calls were needed.

  fibonacci(2)
  assertEquals(calculations, 5) // Assures no further calculations/calls were needed.

  fibonacci(1)
  assertEquals(calculations, 5) // Assures no further calculations/calls were needed.

  fibonacci(0)
  assertEquals(calculations, 5) // Assures no further calculations/calls were needed.
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
  assertEquals(calculations, 9)

  knapsack({ n: 3, w: 2, profits: [10, 20, 0], weights: [1, 1, 1] })
  assertEquals(calculations, 9)

  knapsack({ n: 4, w: 2, profits: [10, 20, 0], weights: [1, 1, 1] })
  assertEquals(calculations, 10)

  knapsack({ n: 4, w: 2, profits: [10, 20, 0], weights: [1, 1, 1] })
  assertEquals(calculations, 10)

  knapsack({ n: 4, w: 2, profits: [10, 20, 0], weights: [1, 1, 1] })
  assertEquals(calculations, 10)
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
  assertEquals(calculations, 9)

  knapsack([3, 2, [10, 20, 0], [1, 1, 1]])
  assertEquals(calculations, 9)

  knapsack([4, 2, [10, 20, 0], [1, 1, 1]])
  assertEquals(calculations, 10)

  knapsack([4, 2, [10, 20, 0], [1, 1, 1]])
  assertEquals(calculations, 10)

  knapsack([4, 2, [10, 20, 0], [1, 1, 1]])
  assertEquals(calculations, 10)
})
