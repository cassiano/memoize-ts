"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mod_ts_1 = require("https://deno.land/std@0.224.0/assert/mod.ts");
const memoize_ts_1 = require("./memoize.ts");
Deno.test('Memoizing 0 parameters functions', () => {
    const e = (0, memoize_ts_1.memoize)(() => Math.random());
    const memoizedValue = e();
    (0, mod_ts_1.assertEquals)(e(), memoizedValue); // Assures read memoized value.
    (0, mod_ts_1.assertEquals)(e(), memoizedValue); // Assures read memoized value.
    (0, mod_ts_1.assertEquals)(e(), memoizedValue); // Assures read memoized value.
});
Deno.test('Memoizing 1 parameter functions', () => {
    const e = (0, memoize_ts_1.memoize)((a) => a + Math.random());
    const memoizedValue1 = e(1);
    const memoizedValue2 = e(2);
    (0, mod_ts_1.assertNotEquals)(memoizedValue1, memoizedValue2);
    (0, mod_ts_1.assertEquals)(e(1), memoizedValue1); // Assures read memoized value.
    (0, mod_ts_1.assertEquals)(e(1), memoizedValue1); // Assures read memoized value.
    (0, mod_ts_1.assertEquals)(e(1), memoizedValue1); // Assures read memoized value.
    (0, mod_ts_1.assertEquals)(e(2), memoizedValue2); // Assures read memoized value.
    (0, mod_ts_1.assertEquals)(e(2), memoizedValue2); // Assures read memoized value.
    (0, mod_ts_1.assertEquals)(e(2), memoizedValue2); // Assures read memoized value.
});
Deno.test('Memoizing factorial() function', () => {
    let calculations = 0;
    const factorial = (0, memoize_ts_1.memoize)((n) => (calculations++, n <= 1 ? 1 : n * factorial(n - 1)), ([a], [b]) => a === b);
    (0, mod_ts_1.assertEquals)(calculations, 0);
    factorial(10);
    (0, mod_ts_1.assertEquals)(calculations, 10);
    factorial(10);
    (0, mod_ts_1.assertEquals)(calculations, 10); // Assures no further calculations/calls were needed.
    factorial(10);
    (0, mod_ts_1.assertEquals)(calculations, 10); // Assures no further calculations/calls were needed.
    factorial(9);
    (0, mod_ts_1.assertEquals)(calculations, 10); // Assures no further calculations/calls were needed.
    factorial(8);
    (0, mod_ts_1.assertEquals)(calculations, 10); // Assures no further calculations/calls were needed.
    factorial(11);
    (0, mod_ts_1.assertEquals)(calculations, 11);
    factorial(11);
    (0, mod_ts_1.assertEquals)(calculations, 11); // Assures no further calculations/calls were needed.
});
Deno.test('Memoizing fibonacci() function', () => {
    let calculations = 0;
    const fibonacci = (0, memoize_ts_1.memoize)((n) => (calculations++, n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2)));
    (0, mod_ts_1.assertEquals)(calculations, 0);
    fibonacci(0);
    (0, mod_ts_1.assertEquals)(calculations, 1);
    fibonacci(1);
    (0, mod_ts_1.assertEquals)(calculations, 2);
    fibonacci(2);
    (0, mod_ts_1.assertEquals)(calculations, 3);
    fibonacci(3);
    (0, mod_ts_1.assertEquals)(calculations, 4);
    fibonacci(4);
    (0, mod_ts_1.assertEquals)(calculations, 5);
    fibonacci(4);
    (0, mod_ts_1.assertEquals)(calculations, 5); // Assures no further calculations/calls were needed.
    fibonacci(3);
    (0, mod_ts_1.assertEquals)(calculations, 5); // Assures no further calculations/calls were needed.
    fibonacci(2);
    (0, mod_ts_1.assertEquals)(calculations, 5); // Assures no further calculations/calls were needed.
    fibonacci(1);
    (0, mod_ts_1.assertEquals)(calculations, 5); // Assures no further calculations/calls were needed.
    fibonacci(0);
    (0, mod_ts_1.assertEquals)(calculations, 5); // Assures no further calculations/calls were needed.
});
