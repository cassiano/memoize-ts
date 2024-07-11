const DEBUG = false

type MemoizeCacheType<T> = { key: unknown[]; value: T }[]

type MemoizeUtilsCommonType<T> = {
  clearAll: () => void
  getCache: () => MemoizeCacheType<T>
}

type MemoizeFnType<T> = (...args: unknown[]) => T

type comparisonFnType<T> = (
  leftArgs: Parameters<MemoizeFnType<T>>,
  rightArgs: Parameters<MemoizeFnType<T>>,
) => boolean

type EmptyObjectType = Record<string | number | symbol, never>

/**
 * A function that compares two values. Its default behavior is to compare each parameter individually
 * with the standand `===` JS's strict-equals operator, taking care of objects, maps and arrays of
 * any depth. Classes (in fact, class instances) are covered, too.
 *
 * @template T - The values type
 * @param {T} left - The left value.
 * @param {T} right - The right value.
 * @returns {boolean} - Whether the 2 values are considered equal
 */

export const compareValues = <T>(left: T, right: T): boolean => {
  if (left === right) return true // Are exactly the same values?

  if (typeof left !== typeof right) return false // Do they have different types? In general flagged by TS at compile-time, but still needed when running is JS.

  // Are both values arrays?
  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) return false // Arrays have different lengths?

    return left.every((leftValue, i) => compareValues(leftValue, right[i])) // Do all values match?
  }

  // Are both values objects? PS: one (and only one) of them could possibly be `null`.
  if (typeof left === 'object' && typeof right === 'object') {
    if (left === null || right === null) return false // Is either value `null`?

    if (left instanceof Map && right instanceof Map) {
      // Maps have different number of keys?
      if (left.size !== right.size) return false

      // Or different keys (order matter)?
      if (!compareValues([...left.keys()], [...right.keys()])) return false

      // Do all key+value pairs match?
      return ([...left.entries()] as [unknown, unknown][]).every(
        ([leftKey, leftValue]) => compareValues(leftValue, right.get(leftKey)),
      )
    } else {
      const leftKeys = Object.keys(left)
      const rightKeys = Object.keys(right)

      if (
        leftKeys.length !== rightKeys.length || // Objects have different number of keys?
        !compareValues(leftKeys.sort(), rightKeys.sort()) // Or different keys (no matter their order)?
      )
        return false

      // Do all key+value pairs match?
      return Object.entries(left).every(([leftKey, leftValue]) =>
        compareValues(leftValue, right[leftKey as keyof typeof right]),
      )
    }
  }

  // Values are not equal!
  return false
}

// TS types generator: https://tsplay.dev/NnY6qw

// ====================================
// Copy generated types below this line
/* prettier-ignore */ type MemoizeUtilsType<T> = { clearEntry: (...args: unknown[]) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils0ParamsType<T> = EmptyObjectType & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils1ParamType<T, P1> = { clearEntry: (p1: P1) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils2ParamsType<T, P1, P2> = { clearEntry: (p1: P1, p2: P2) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils3ParamsType<T, P1, P2, P3> = { clearEntry: (p1: P1, p2: P2, p3: P3) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils4ParamsType<T, P1, P2, P3, P4> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils5ParamsType<T, P1, P2, P3, P4, P5> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils6ParamsType<T, P1, P2, P3, P4, P5, P6> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils7ParamsType<T, P1, P2, P3, P4, P5, P6, P7> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils8ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils9ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils10ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils11ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils12ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils13ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils14ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils15ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils16ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils17ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils18ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils19ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils20ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils21ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils22ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils23ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22, p23: P23) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils24ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22, p23: P23, p24: P24) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils25ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22, p23: P23, p24: P24, p25: P25) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils26ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22, p23: P23, p24: P24, p25: P25, p26: P26) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils27ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22, p23: P23, p24: P24, p25: P25, p26: P26, p27: P27) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils28ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22, p23: P23, p24: P24, p25: P25, p26: P26, p27: P27, p28: P28) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils29ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22, p23: P23, p24: P24, p25: P25, p26: P26, p27: P27, p28: P28, p29: P29) => void; } & MemoizeUtilsCommonType<T>;
/* prettier-ignore */ type MemoizeUtils30ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29, P30> = { clearEntry: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22, p23: P23, p24: P24, p25: P25, p26: P26, p27: P27, p28: P28, p29: P29, p30: P30) => void; } & MemoizeUtilsCommonType<T>;

/* prettier-ignore */ type Memoize0ParamsType<T> = () => T;
/* prettier-ignore */ type Memoize1ParamType<T, P1> = (p1: P1) => T;
/* prettier-ignore */ type Memoize2ParamsType<T, P1, P2> = (p1: P1, p2: P2) => T;
/* prettier-ignore */ type Memoize3ParamsType<T, P1, P2, P3> = (p1: P1, p2: P2, p3: P3) => T;
/* prettier-ignore */ type Memoize4ParamsType<T, P1, P2, P3, P4> = (p1: P1, p2: P2, p3: P3, p4: P4) => T;
/* prettier-ignore */ type Memoize5ParamsType<T, P1, P2, P3, P4, P5> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5) => T;
/* prettier-ignore */ type Memoize6ParamsType<T, P1, P2, P3, P4, P5, P6> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6) => T;
/* prettier-ignore */ type Memoize7ParamsType<T, P1, P2, P3, P4, P5, P6, P7> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7) => T;
/* prettier-ignore */ type Memoize8ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8) => T;
/* prettier-ignore */ type Memoize9ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9) => T;
/* prettier-ignore */ type Memoize10ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10) => T;
/* prettier-ignore */ type Memoize11ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11) => T;
/* prettier-ignore */ type Memoize12ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12) => T;
/* prettier-ignore */ type Memoize13ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13) => T;
/* prettier-ignore */ type Memoize14ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14) => T;
/* prettier-ignore */ type Memoize15ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15) => T;
/* prettier-ignore */ type Memoize16ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16) => T;
/* prettier-ignore */ type Memoize17ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17) => T;
/* prettier-ignore */ type Memoize18ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18) => T;
/* prettier-ignore */ type Memoize19ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19) => T;
/* prettier-ignore */ type Memoize20ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20) => T;
/* prettier-ignore */ type Memoize21ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21) => T;
/* prettier-ignore */ type Memoize22ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22) => T;
/* prettier-ignore */ type Memoize23ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22, p23: P23) => T;
/* prettier-ignore */ type Memoize24ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22, p23: P23, p24: P24) => T;
/* prettier-ignore */ type Memoize25ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22, p23: P23, p24: P24, p25: P25) => T;
/* prettier-ignore */ type Memoize26ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22, p23: P23, p24: P24, p25: P25, p26: P26) => T;
/* prettier-ignore */ type Memoize27ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22, p23: P23, p24: P24, p25: P25, p26: P26, p27: P27) => T;
/* prettier-ignore */ type Memoize28ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22, p23: P23, p24: P24, p25: P25, p26: P26, p27: P27, p28: P28) => T;
/* prettier-ignore */ type Memoize29ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22, p23: P23, p24: P24, p25: P25, p26: P26, p27: P27, p28: P28, p29: P29) => T;
/* prettier-ignore */ type Memoize30ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29, P30> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9, p10: P10, p11: P11, p12: P12, p13: P13, p14: P14, p15: P15, p16: P16, p17: P17, p18: P18, p19: P19, p20: P20, p21: P21, p22: P22, p23: P23, p24: P24, p25: P25, p26: P26, p27: P27, p28: P28, p29: P29, p30: P30) => T;

/**
 * A function that memoizes the result of `fn` based on the actual arguments provided.
 * It can optionally receive a custom comparison function for determining cache hits.
 * Additional utility methods are provided, in order to manage the associated cache.
 *
 * @template T - The return type of the memoized function (always inferred automatically by TS).
 * @template P1, P2, ... Pn - The types of each of the n function's arguments (always inferred automatically by TS).
 * @param {MemoizeFnType<T>} fn - The function to be memoized.
 * @param {comparisonFnType<T>} [comparisonFn] - An optional custom comparison function for determining cache hits based on the actual arguments passed.
 * @returns {MemoizeFnType<T> & MemoizeUtilsType<T>} - The memoized function with additional utility methods.
 */

// @ts-expect-error: Temporary fix to avoid a TS warning in the overloaded signatures below, due to the use of the `comparisonFn()` optional callback.
/* prettier-ignore */ export function memoize<T>(fn: Memoize0ParamsType<T>): Memoize0ParamsType<T> & MemoizeUtils0ParamsType<T>;
/* prettier-ignore */ export function memoize<T, P1>(fn: Memoize1ParamType<T, P1>, comparisonFn?: (leftArgs: [P1], rightArgs: [P1]) => boolean): Memoize1ParamType<T, P1> & MemoizeUtils1ParamType<T, P1>;
/* prettier-ignore */ export function memoize<T, P1, P2>(fn: Memoize2ParamsType<T, P1, P2>, comparisonFn?: (leftArgs: [P1, P2], rightArgs: [P1, P2]) => boolean): Memoize2ParamsType<T, P1, P2> & MemoizeUtils2ParamsType<T, P1, P2>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3>(fn: Memoize3ParamsType<T, P1, P2, P3>, comparisonFn?: (leftArgs: [P1, P2, P3], rightArgs: [P1, P2, P3]) => boolean): Memoize3ParamsType<T, P1, P2, P3> & MemoizeUtils3ParamsType<T, P1, P2, P3>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4>(fn: Memoize4ParamsType<T, P1, P2, P3, P4>, comparisonFn?: (leftArgs: [P1, P2, P3, P4], rightArgs: [P1, P2, P3, P4]) => boolean): Memoize4ParamsType<T, P1, P2, P3, P4> & MemoizeUtils4ParamsType<T, P1, P2, P3, P4>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5>(fn: Memoize5ParamsType<T, P1, P2, P3, P4, P5>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5], rightArgs: [P1, P2, P3, P4, P5]) => boolean): Memoize5ParamsType<T, P1, P2, P3, P4, P5> & MemoizeUtils5ParamsType<T, P1, P2, P3, P4, P5>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6>(fn: Memoize6ParamsType<T, P1, P2, P3, P4, P5, P6>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6], rightArgs: [P1, P2, P3, P4, P5, P6]) => boolean): Memoize6ParamsType<T, P1, P2, P3, P4, P5, P6> & MemoizeUtils6ParamsType<T, P1, P2, P3, P4, P5, P6>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7>(fn: Memoize7ParamsType<T, P1, P2, P3, P4, P5, P6, P7>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7], rightArgs: [P1, P2, P3, P4, P5, P6, P7]) => boolean): Memoize7ParamsType<T, P1, P2, P3, P4, P5, P6, P7> & MemoizeUtils7ParamsType<T, P1, P2, P3, P4, P5, P6, P7>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8>(fn: Memoize8ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8]) => boolean): Memoize8ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8> & MemoizeUtils8ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9>(fn: Memoize9ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9]) => boolean): Memoize9ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9> & MemoizeUtils9ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10>(fn: Memoize10ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10]) => boolean): Memoize10ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10> & MemoizeUtils10ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11>(fn: Memoize11ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11]) => boolean): Memoize11ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11> & MemoizeUtils11ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12>(fn: Memoize12ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12]) => boolean): Memoize12ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12> & MemoizeUtils12ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13>(fn: Memoize13ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13]) => boolean): Memoize13ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13> & MemoizeUtils13ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14>(fn: Memoize14ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14]) => boolean): Memoize14ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14> & MemoizeUtils14ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15>(fn: Memoize15ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15]) => boolean): Memoize15ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15> & MemoizeUtils15ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16>(fn: Memoize16ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16]) => boolean): Memoize16ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16> & MemoizeUtils16ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17>(fn: Memoize17ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17]) => boolean): Memoize17ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17> & MemoizeUtils17ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18>(fn: Memoize18ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18]) => boolean): Memoize18ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18> & MemoizeUtils18ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19>(fn: Memoize19ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19]) => boolean): Memoize19ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19> & MemoizeUtils19ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20>(fn: Memoize20ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20]) => boolean): Memoize20ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20> & MemoizeUtils20ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21>(fn: Memoize21ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21]) => boolean): Memoize21ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21> & MemoizeUtils21ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22>(fn: Memoize22ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22]) => boolean): Memoize22ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22> & MemoizeUtils22ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23>(fn: Memoize23ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23]) => boolean): Memoize23ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23> & MemoizeUtils23ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24>(fn: Memoize24ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24]) => boolean): Memoize24ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24> & MemoizeUtils24ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25>(fn: Memoize25ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25]) => boolean): Memoize25ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25> & MemoizeUtils25ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26>(fn: Memoize26ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26]) => boolean): Memoize26ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26> & MemoizeUtils26ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27>(fn: Memoize27ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27]) => boolean): Memoize27ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27> & MemoizeUtils27ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28>(fn: Memoize28ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28]) => boolean): Memoize28ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28> & MemoizeUtils28ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29>(fn: Memoize29ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29]) => boolean): Memoize29ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29> & MemoizeUtils29ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29>;
/* prettier-ignore */ export function memoize<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29, P30>(fn: Memoize30ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29, P30>, comparisonFn?: (leftArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29, P30], rightArgs: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29, P30]) => boolean): Memoize30ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29, P30> & MemoizeUtils30ParamsType<T, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29, P30>;
// Copy generated types above this line
// ====================================

export function memoize<T>(
  fn: MemoizeFnType<T>,
  comparisonFn?: comparisonFnType<T>,
): MemoizeFnType<T> & MemoizeUtilsType<T> {
  const cache: MemoizeCacheType<T> = []

  const findCacheIndex = (cacheEntry: unknown[]) =>
    cache.findIndex(({ key }) =>
      (comparisonFn ?? compareValues)(key, cacheEntry),
    )

  const memoizedFn: MemoizeFnType<T> & MemoizeUtilsType<T> = (...args) => {
    let value: T
    const index = findCacheIndex(args)

    if (index !== -1) {
      if (DEBUG) console.log('Retrieving memoized value for', args)

      value = cache[index].value
    } else {
      value = fn(...args)

      cache.unshift({ key: args, value })
    }

    return value
  }

  memoizedFn.clearAll = () => {
    cache.length = 0
  }

  // This method is needed only for functions with at least 1 parameter.
  if (fn.length > 0) {
    memoizedFn.clearEntry = (...args: unknown[]) => {
      const index = findCacheIndex(args)

      if (index !== -1) cache.splice(index, 1)
    }
  }

  memoizedFn.getCache = () => cache

  return memoizedFn
}
