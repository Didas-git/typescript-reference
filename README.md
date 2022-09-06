# Typescript Reference

- [Typescript Reference](#typescript-reference)
  - [Basics](#basics)
    - [Primitive Types](#primitive-types)
    - [Type Declaration](#type-declaration)
      - [Implicit](#implicit)
      - [Explicit](#explicit)
  - [Main Sources](#main-sources)

Basics
------

### Primitive Types

Typescript primitives are the same as the [javascript](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) primitives with some additions.

- `string` -
A string is a sequence of characters contained inside `" "`, `' '` or `` ` ` ``.

```ts
let str = "Any string";
```

- `number` -
A number in javascript is a [double-precision 64-bit floating point format (IEEE 754)](https://en.wikipedia.org/wiki/Double_precision_floating-point_format).

```ts
let num = 3;
```

- `bigint` -
A bingint is a integer represented in an [arbitrary precision format](https://en.wikipedia.org/wiki/Arbitrary-precision_arithmetic). In javascript is represented by a number followed by `n`

```ts
let bint = 3n;
```

- `boolean` -
A boolean is a type that can be either `true` or `false`.

```ts
let bool = true;
```

- `undefined` -
Undefined is a [primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) value automatically assigned to [variables](https://developer.mozilla.org/en-US/docs/Glossary/Variable) that have just been declared, or to formal [arguments](https://developer.mozilla.org/en-US/docs/Glossary/Argument) for which there are no actual arguments.

```ts
// In this case undefined has to be explicit declared because otherwise typescript will make it `any`, more on that in a moment
let u: undefined;
```

- `symbol` -
A symbol can only be created using the `Symbol` constructor and it is always[^1] unique.

```ts
const sym = Symbol();
```

- `unique symbol` -
A unique symbol is a subtype of symbol and can only appear if explicit assigned and can only be assigned to a constant using `Symbol()` and `Symbol.for()`.

```ts 
const sym1: unique symbol = Symbol()

let sym2: unique symbol = Symbol()
//  ^^^^
// A variable whose type is a 'unique symbol' type must be 'const'.
```

- `null` -
For information about null refer to the [MDN](https://developer.mozilla.org/en-US/docs/Glossary/Null) docs.

```ts
const n1 = null

// For non constants you have to explicit say the type is null otherwise typescript will say its `any`
let n2: null = null;
```

- `any` -
As the name sugests, `any` can be assigned to any type and wont do any type checking assuming that you know the environment better than typescript. 

```ts
let a: any;

a = "";
a = 3;
a = {};
a.foo();
a["bar"];
a();

const b: number = a;
```

- `unknown` -
Basically the same as `any` but doesnt allow dot notation, indexing and assigning to other variables. Using `unknown` over `any` is recommended and you should always do it unless you encounter some odd cases.

```ts
let a: unknown;

a = "";
a = 3;
a = {};
a.foo();
//
// Object is of type 'unknown'.
a["bar"];
//
// Object is of type 'unknown'.
a();
//
// Object is of type 'unknown'.

const b: number = a
//    ^
// Type 'unknown' is not assignable to type 'number'.
```

- `never` -
The never type can usually appear when union types have nothing left and can be used as a return type for functions that throw exeptions. The most comun use of `never` is on [condtional](#conditional-types) and [complex](#complex-types) types but more on that later.

```ts 
//source: https://www.typescriptlang.org/docs/handbook/2/functions.html#never
function fail(msg: string): never {
	throw new Error(msg)
}

function fn(x: string | number) {
	if (typeof x === "string") {
		// do something
	} else if (typeof x === "number") {
		// do something else
	} else {
        x;
//      ^? - (parameter) x: never
	}
}
```

- `void` -
`void` is a typescript type that is used for functions that do not return anything or return functions that return void

```ts
function returnVoid() {
    return;
}
```

[^1]: There is a way to reproduce the same symbol every time.

### Type Declaration

#### Implicit

Implicit type declaration is when you declare a variable without providing a type directly and living that work to the compiler.

```ts 
let str = "A string";
//    ^? - let str: string
```

#### Explicit

Explicit type declaration is when you declare a variable assigning it a type.

```ts 
let str: string = "A string";
//    ^? - let str: string
```

Main Sources
------------
[**`MDN`**](https://developer.mozilla.org/)
[**`TS Handbook`**](https://www.typescriptlang.org/docs/handbook)
