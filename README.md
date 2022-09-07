# Typescript Reference

- [Typescript Reference](#typescript-reference)
  - [Basics](#basics)
    - [Primitive Types](#primitive-types)
    - [Type Declaration](#type-declaration)
      - [Implicit](#implicit)
      - [Explicit](#explicit)
    - [Type Manipulation](#type-manipulation)
      - [Type Alias](#type-alias)
      - [Intersection](#intersection)
      - [Union](#union)
      - [Interfaces](#interfaces)
      - [Extends](#extends)
      - [`type` vs `interface`](#type-vs-interface)
        - [Extending](#extending)
        - [Adding fields](#adding-fields)
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
A bigint is a integer represented in an [arbitrary precision format](https://en.wikipedia.org/wiki/Arbitrary-precision_arithmetic). In javascript is represented by a number followed by `n`

```ts
let bint = 3n;
```

- `boolean` -
A boolean is a type that can be either `true` or `false`.

```ts
let bool = true;
```

- `object` -
The object primitive represents anything that has an index signature and isn't another primitive.

```ts
let a: object;

a = "";
//
// Type 'string' is not assignable to type 'object'.
a = 3;
//
// Type 'number' is not assignable to type 'object'.
a = {};
a.foo();
//^^^
// Property 'foo' does not exist on type 'object'.
a["bar"];
//^^^^^^
// Element implicitly has an 'any' type because expression of type '"bar"' can't be used to index type '{}'.
//   Property 'bar' does not exist on type '{}'.
a();
//
// This expression is not callable.
//   Type '{}' has no call signatures.
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

- [`null`](https://developer.mozilla.org/en-US/docs/Glossary/Null) -
A primitive type annotating that no memory address is assigned to this variable. It behaves similar to undefined however, it's considered an object.

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
Basically the same as `any` but doesnt allow dot notation, indexing and assigning to other variables. Using `unknown` over `any` is highly recommended to prevent possible oversights.

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

- [`never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#never) -
The never type can usually appear when union types have nothing left and can be used as a return type for functions that throw exeptions. The most comun use of `never` is on [condtional](#conditional-types) and [complex](#complex-types) types but more on that later.

```ts
function fail(msg: string): never {
    throw new Error(msg)
}

function fn(x: string | number): void {
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
`void` is a typescript type that is used for functions that do not return anything or return functions that return void.

```ts
function returnVoid() {
//       ^? - function returnVoid(): void
    return;
}
```

### Type Declaration

#### Implicit

An implicit type declaration is when you declare a variable without providing a type directly and leaving that work to the compiler.

```ts
let str = "A string";
//  ^? - let str: string
```

#### Explicit

An explicit type declaration is when you declare a variable with an assigned type.

```ts
let str: string = "A string";
//  ^? - let str: string
```

### Type Manipulation

#### [Type Alias](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)

The `type` keyword is used to create and name any type but as it is only an alias, it cannot be used to create  different or unique versions of the same type.

```ts
type Point = {
    x: number,
    y: number
};

type ConcatenatedString = string;

function concat(str1: string, str2: string): ConcatenatedString {
  return str1 + str2;
}

// Create a sanitized input
let helloWorld = concat("hello ", "world");
 
// Can still be re-assigned with a string though
helloWorld = "Hello";
```

#### Intersection

The intersection operator (`&`) can be used just like the `extends` keyword but for type alises instead of classes.

```ts
interface Circle {
    radius: number;
}

interface Colors {
    r: number;
    g: number;
    b: number;
}

type ColorfullCircle = Circle & Colors;

// It can also be used inside functions
function draw(circle: Circle & Colors): Circle & Colors {
    return circle;
}

draw({ radius: 30 })
//   ^^^^^^^^^^^^^^
// Argument of type '{ radius: number; }' is not assignable to parameter of type 'Circle & Colors'.
//   Type '{ radius: number; }' is missing the following properties from type 'Colors': r, g, b
```

#### Union

The union operator (`|`) in typescript works like an `or`.</br>
When paired with `never` a union type will ignore it and removei t from the union.

```ts
type StringOrNumber = string | number;

let a: StringOrNumber = "A string";
a = 3;
a = true;
//
// Type 'boolean' is not assignable to type 'StringOrNumber'.
a = {};
//
// Type '{}' is not assignable to type 'StringOrNumber'.

// As you can see the `never` is excluded
type BooleanOrNumber = boolean | never | number
//   ^? - type BooleanOrNumber = number | boolean
```

#### [Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)

An `interface` declaration is another way to declare a type. It's mostly used to declare object types. They can be extended by other interfaces and implemented in classes using the implements keyword.

```ts
interface Point {
    x: number;
    y: number;
}
```

#### Extends

#### `type` vs `interface`

Type alias and interface are pretty simillar, the main differences are:
- A type cannot be extended (using the `extends` keyword).
- A type cannot have duplicate identifiers.
- A type does not extend a class wit hthe same name.

##### Extending

<table>
<tr>
<th>Interfaces</th>
<th>Types</th>
</tr>
<tr>
<td>

```ts
interface Animal {
    name: string;
}

interface Cat extends Animal {
    race: string;
}
```

</td>
<td>

```ts
type Animal = {
    name: string
}

type Cat = Animal & {
    race: string
}
```

</td>
</tr>
</table>

##### Adding fields

<table>
<tr>
<th>Interfaces</th>
<th>Types</th>
</tr>
<tr>
<td>

```ts
interface Story {
    title: string;
}

interface Story {
    body: string;
}
```

</td>
<td>

```ts
type Story = {
//   ^^^^^
// Duplicate identifier 'Story'.
    title: string
}

type Story = {
//   ^^^^^
// Duplicate identifier 'Story'.
    body: string
}
```

</td>
</tr>
</table>

Main Sources
------------
[**`MDN`**](https://developer.mozilla.org/)</br>
[**`TS Handbook`**](https://www.typescriptlang.org/docs/handbook)

[^1]: `Symbol.for` can bypass this unique behaviour, red the [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) for more information.
