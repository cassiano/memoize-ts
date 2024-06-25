import { assertEquals, assertNotEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts'
import { memoize } from './memoize.ts'

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
