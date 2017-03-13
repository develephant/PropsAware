# `PropsAware`

### An event driven global properties store

## Install

```
npm i @develephant/props-aware --save
```

## Usage

```js
const PropsAware = require('@develephant/props-aware')
```

## Example

```js
const PA = require('@develephant/props-aware')

props = PA.props()

PA.on('score', (val) => {
  console.log(val)
})

props.score = 100

// 100

```

### In Classes

__Note:__ _Classes can be in seperate files as well._

```js
const PA = require('@develephant/props-aware')

class A {
  constructor() {
    this.props = PA.props()

    PA.on('score', (val) => {
      console.log(val)
    })
  }
}

class B {
  constructor() {
    this.props = PA.props()
    this.props.score = 100
  }
}

let classA = new A()

let classB = new B() /* Class A will output "100" */
```

### In Objects

__Note:__ _Objects can be in seperate files as well._

```js
const PA = require('@develephant/parse-aware')

const ObjA = {
  props: PA.props(),
  listen() {
    PA.on('greeting', (val) => {
      console.log(greeting)
    })
  }
}

const ObjB = {
  props: PA.props()
}

ObjA.listen()

ObjB.props.greeting = 'Hello' /* ObjA will output "Hello" */

ObjA.props.greeting = 'Hola' /* ObjA will output "Hola" */

```

### A Function

```js
const PA = require('@develephant/props-aware')

modules.export = function() {
  this.props = PA.props()
  this.props.greeting = 'Howdy'
  PA.on('score', (val) => {
    console.log(val)
  })
}

// Assuming the Objects above...

/* ObjA will output 'Howdy' */

// Call score through Class B above
classB.props.score = 1000

/* This Function will output 1000 *\
/* ObjA will output 1000 */

```

## API

### `props`

Returns the __PropsAware__ global property table.

```js
let props = PropsAware.props()
```

### `on`

Attaches a listener to __PropsAware__ for a specific properties updates.

```js
PropsAware.on(property, (val, prop) => {
  console.log('updated', prop, val)
})
```

### `onAll`

Attaches a listener to __PropsAware__ for all property updates.

```js
PropsAware.onAll((val, prop) {
  console.log('updated', prop, val)
})
```

### `onDel`

Removes a properties update listeners. This destroys __all__ update listeners for the property. 

> The "global" listener `onAll` will still receieve updates. Other listeners need to be reactivated to be used again.

```js
PropsAware.onDel((prop, val) => {
  console.log('removed', prop, val)
})
```

### `has`

Checks to see if a specific property is housed in the __PropsAware__ property table.

```js
let has_username = PropsAware.has('username')
```

### `del`

Removes __all__ update listeners for a specific property.

```js
let success = PropsAware.del('score')
```

^_^

---

#### `PropsAware` &Star; &copy; 2017 develephant &Star; Apache-2.0 license
