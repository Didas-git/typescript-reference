# Typescript Reference

- [Typescript Reference](#typescript-reference)
  - [Basics](#basics)
    - [Primitive Types](#primitive-types)
    - [Type Declaration](#type-declaration)
      - [Implicit](#implicit)
      - [Explicit](#explicit)
      - [Arrays](#arrays)
      - [Tuples](#tuples)
      - [Objects](#objects)
      - [Unit Types](#unit-types)
      - [`const` vs `let`](#const-vs-let)
    - [Type Manipulation](#type-manipulation)
      - [Type Alias](#type-alias)
      - [Interfaces](#interfaces)
      - [Intersection](#intersection)
      - [Union](#union)
      - [Optional](#optional)
      - [Extends](#extends)
      - [Implements](#implements)
      - [Type Assertion](#type-assertion)
        - [`as const`](#as-const)
      - [`type` vs `interface`](#type-vs-interface)
        - [Extending](#extending)
        - [Adding fields](#adding-fields)
        - [Augmenting Classes](#augmenting-classes)
  - [Main Sources](#main-sources)

Basics
------

In this chapter i will focus on just showing the pure basics of typescript, what you have/should know to get started creating your projects and some things to might be aware when you start to move to more advanced/complex types.

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
The never type can usually appear when union types have nothing left and can be used as a return type for functions that throw exeptions. The most comun use of `never` is on [conditional](#conditional-types) and [complex](#complex-types) types but more on that later.

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

#### Arrays

Declaring array types can be done in 2 ways:
- Using the `Array` generic.
- Using an array literal.

```ts
let stringArray: Array<string>;
let numberArray: number[];
let numberAndBooleanArray: Array<number | boolean>;
let stringAndBooleanArray: (string | boolean)[];
```

#### Tuples

A tuple is a fixed length array that can have a unique type per element, there are however ways to define an infinite length tuple, however, is not recommended and you should use an [array](#arrays) instead.

```ts
let tuple: [string, number, boolean] = ["hello", 3, true, "world"];
//  ^^^^^
// Type '[string, number, true, string]' is not assignable to type '[string, number, boolean]'.
//   Source has 4 element(s) but target allows only 3.
tuple = ["hello", true];
//                ^^^^
// Type 'boolean' is not assignable to type 'number'.

let infiniteTuple: [string, ...Array<number>] = ["hello", 1, 2, 3];
infiniteTuple = ["hello", 1, 2, "world"];
//^^^^^^^^^^^
// Type '[string, number, number, string]' is not assignable to type '[string, ...number[]]'.
//   Type at positions 1 through 3 in source is not compatible with type at position 1 in target.
//     Type 'string | number' is not assignable to type 'number'.
//       Type 'string' is not assignable to type 'number'.
```

#### Objects

There are 3 ways to declare object types, those being:
- Using [`interfaces`](#interfaces) or [`type`](#type-alias) aliases.
- Using object literals.
- Using the `Record` generic.

```ts
interface IObj {
    a: string;
    b: number
}

type TObj = {
    a: string,
    b: number
}

let iObj: IObj;
let tObj: TObj;
let normalObj: { a: string, b: number };
let recordObj: Record<string, string | number>;
let recordObj2: Record<"a" | "b", string | number>
```

If you want to create a tuple that you can assign any object, using `Record` is highly recommended over the `object` type.

```ts
let obj: object = {};
obj = [];

// More on 'Record' and 'PropertyKey' later
let record: Record<PropertyKey, unknown> = {};
record = [];
//^^^^
// Type 'never[]' is not assignable to type 'Record<PropertyKey, unknown>'.
//   Index signature for type 'string' is missing in type 'never[]'.
```

#### Unit Types

Unit types are subsets of [primitive types](#primitive-types) that can only contain one value.

```ts
let foo = "foo";
//  ^? - let foo: string

let bar: "bar";
//  ^? - let bar: "bar"

bar = foo
//^
// Type 'string' is not assignable to type '"bar"'.
```

#### `const` vs `let`

In vanilla javascript the main difference between using `const` and `let` is that you cannot reassing nor redeclare a `const`, however, typescript adds another main difference.\
Values assigned to a `const` will turn into [`unit types`](#unit-types) when possible*, while `let` will be assigned to its [`primitive`](#primitive-types) type.

<h5>* By default 'objects' will work the same in 'const' as they do in 'let', however, this can be changed by using 'as const'.</h5>

```ts
const foo = "foo";
//    ^? - const foo: "foo"
let bar = "bar";
//  ^? - let bar: string

const num = 3;
//    ^? - const num: 3
let lnum = 3;
//  ^? - let lnum: number

const obj = { a: "hello", b: 3 }
//    ^? - const obj: {
//        a: string;
//        b: number;
//    }
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

#### [Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)

An `interface` declaration is another way to declare a type and it's mostly used to declare object types. They can be extended by other interfaces and implemented in classes using the implements keyword.

```ts
interface Point {
    x: number;
    y: number;
}
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

// It can also be used inside function arguments and return types
function draw(circle: Circle & Colors): Circle & Colors {
    return circle;
}

draw({ radius: 30 });
//   ^^^^^^^^^^^^^^
// Argument of type '{ radius: number; }' is not assignable to parameter of type 'Circle & Colors'.
//   Type '{ radius: number; }' is missing the following properties from type 'Colors': r, g, b
```

#### Union

The union operator (`|`) in typescript works like an `or`.\
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
type BooleanOrNumber = boolean | never | number;
//   ^? - type BooleanOrNumber = number | boolean

// It can also be used inside function arguments and return types
function stringOrNumber(o: string | number): string | number {
    return o;
}
```

#### Optional

In typescript you can use `?` on a property to make it optional.\
On a side note, making a type `undefined` doesnt mean it is optional even tho optional types may show as possibly `undefined`.

```ts
interface User {
    name: string;
    age?: number;
    genre: string | undefined;
}

const user1: User = {
    name: "Martin",
    genre: undefined,
}

const user2: User = {
//    ^^^^^
// Property 'genre' is missing in type '{ name: string; }' but required in type 'User'.
    name: "Niek",
}

```

#### Extends

The `extends` keyword can be used in 2 ways:
- [Conditional Types](#conditional-types) that will be covered later on.
- Extend interfaces.

Extending interfaces works just like extending classes in vanilla javascript but with the difference that you can extend multiple interfaces.

```ts
interface Label {
    labelName: string;
    date: string;
}

interface Artist {
    artistName: string;
} 

interface Song extends Label, Artist {
    songName: string;
    realeseDate: Date;
}
```

#### Implements

The `implements` keyword can be used to make sure than a class satisfies the definition of the given interface/type.

```ts
interface Foo {
    foo: () => void;
}

type Bar = {
    bar: () => void
}

class MyClass implements Foo, Bar {
//    ^^^^^^^
// Class 'MyClass' incorrectly implements interface 'Bar'.
//   Property 'bar' is missing in type 'MyClass' but required in type 'Bar'.
    foo() {
        return;
    }
}
```

#### Type Assertion

Type assertion can be used to convert one type to another. In very unique cases you might need to cast to `unknown` first, however, it's not recommended.\
Type assertion can be done in 2 ways:
- Using `<>` (only works on non JSX/TSX files).
- Using the `as` keyword.

```ts
const a = <number>"hello";
//        ^^^^^^^^^^^^^^^
// Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
const b = <number><unknown>"hello";
const x = "hello" as number;
//        ^^^^^^^^^^^^^^^^^
// Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
const y = "hello" as unknown as number;
```

##### `as const`

The `as const` assertion can be used to make a variable readonly and also preserve its types.

```ts
const obj = { a: "hello", b: 3 } as const
//    ^? - const obj: {
//        readonly a: "hello";
//        readonly b: 3;
//    }

let otherObj = { a: 3, b: "hello" } as const
//  ^? - let otherObj: {
//      readonly a: 3;
//      readonly b: "hello";
//  }
```

#### `type` vs `interface`

Type alias and interface are pretty simillar, the main differences are:
- A type cannot be extended (using the `extends` keyword).
- A type cannot have duplicate identifiers.
- A type does not augment a class with the same name.

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

##### Augmenting Classes

<table>
<tr>
<th>Interfaces</th>
<th>Types</th>
</tr>
<tr>
<td>

```ts
interface MyClass {
    foo: () => void;
    bar(): void;
}

class MyClass {
    bazz() {
        return;
    }
}

const myClassInstance = new MyClass();

myClassInstance.foo();
myClassInstance.bar();
myClassInstance.bazz();
```

</td>
<td>

```ts
type MyClass = {
//   ^^^^^^^
// Duplicate identifier 'MyClass'.
    foo: () => void;
    bar(): void;
}

class MyClass {
//    ^^^^^^^
// Duplicate identifier 'MyClass'.
    bazz() {
        return;
    }
}

const myClassInstance = new MyClass();
//                          ^^^^^^^
// 'MyClass' only refers to a type, but is being used as a value here.
```

</td>
</tr>
</table>

Main Sources
------------
[**`MDN`**](https://developer.mozilla.org/)\
[**`TS Handbook`**](https://www.typescriptlang.org/docs/handbook)

[^1]: `Symbol.for` can bypass this unique behaviour, read the [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) for more information.
