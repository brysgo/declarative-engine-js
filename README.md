# Declarative Engine

[![CircleCI][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Greenkeeper badge][greenkeeper-badge]][greenkeeper]

> simple way to turn imperative code declarative

## Install

```bash
{yarn, npm} add merge-resolver
```

It is no secret that I am a huge fan of GraphQL. But I tend to get lots of push back when suggesting it as a solution to a problem. The pushback is always related to not wanting to learn a new query language and type system. Another argument is for not wanting to bring in huge libraries.

This project is an attempt at putting those arguments to rest by extracting the declarative -> imperative pattern that we all love so much and keeping it dead simple.

# Usage

Create a declarative engine like this:

```js
import createEngine from "declarative-engine";

const executeDeclarativeEngine = createEngine({
  Ball: {
    volume(obj) {
      return (4 / 3) * Math.PI * obj.radius ** 3;
    }
  },
  Basket: {
    height(obj) {
      return `${obj.height} ft`;
    }
  },
  typeFromObj: obj => obj.type
});
```

Finally, you can use it like this:

```js
const result = executeDeclarativeEngine({
  type: "Court",
  ball: {
    type: "Ball",
    radius: 10,
    volume: true
  },
  basket: {
    type: "Basket",
    height: 12
  }
});

console.log(result);
```

And it should Print:

```json
{
   "type":"Court",
   "ball":{
      "type":"Ball",
      "radius":10,
      "volume":4188.790204786391
   },
   "basket":{
      "type":"Basket",
      "height":"12 ft"
   }
}
```

[build-badge]: https://circleci.com/gh/brysgo/declarative-engine-js.svg?style=shield
[build]: https://circleci.com/gh/brysgo/declarative-engine-js

[npm-badge]: https://img.shields.io/npm/v/declarative-engine.png?style=flat-square
[npm]: https://www.npmjs.org/package/declarative-engine


[greenkeeper-badge]: https://badges.greenkeeper.io/brysgo/declarative-engine-js.svg
[greenkeeper]: https://greenkeeper.io/