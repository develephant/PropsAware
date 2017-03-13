# Overview

__PropsAware__ (or `PA`) is a "global" property object that emits events when properties are changed.

You can listen for these changes virutally anywhere in your program. In code it looks like this:

```js
//file-one.js

/* Pull in PropsAware as PA */
const PA = require('@develephant/props-aware')

let props = PA.props()

PA.on('score', (val) => {
  console.log(val)
})

props.score = 300

/* outputs 300 */

``` 

Lets create another JS file, and add the following:

```js
//file-two.js

/* Pull in PropsAware as PA */
const PA = require('@develephant/props-aware')

props = PA.props()

props.score = 500

/* fileone.js will output 500 */

```

## API

## `props`

Retreives the __PropsAware__ property object. All properties on this object emit when set.

```js
const PA = require('@develephant/props-aware')

let props = PA.props()
```

## `on`

Listen for a property update.

```js
const PA = require('@develephant/props-aware')

PA.on('score', (val, prop) => {
  console.log(val)
})


## `has`

Checks to see if a specific property is housed in the __PropsAware__ property table.

```js
const PA = require('@develephant/props-aware')

let has_username = PA.has('username')
```

## `del`

Removes a properties update listeners. This destroys __all__ update listeners for the property.

```js
let success = PA.del('score')
```

## `onAll`

Your program can opt-in to listening to __all__ property changes. When using this method, you would need to filter the messages you want.

```js
PA.onAll((prop, val) => {
  console.log('changed', prop, val)
})
```

## `onDel`

Fired when the `del` method is used in the __PropsAware__ object

```js
PA.onDel((prop, val) => {
  console.log('del', prop, val)
})
```

## Usage Examples

### In Classes

```js
//ClassA.js

const PA = require('@develephant/props-aware')

class ClassA {
  constructor() {
    this.props = PA.props()

    PA.on('score', (val) => {
      console.log(val)
    })
  }
}
module.exports = ClassA
```

```js
//ClassB.js

const PA = require('@develephant/props-aware')

class ClassB {
  constructor() {
    this.props = PA.props()
    this.props.score = 100
  }
}
module.exports = ClassB
```

__Run__

```js
//main.js

const ClassA = require('./ClassA')
const ClassB = require('./ClassB')

const A = new ClassA()
const B = new ClassB() /* Class A will output "100" */
```

### In Objects

```js
//obj-one.js

/* Pull in PropsAware as PA */
const PA = require('@develephant/parse-aware')

const ObjA = {
  props: PA.props(),
  listen() {
    PA.on('greeting', (val) => {
      console.log(greeting)
    })
  }
}
module.exports = ObjA
```

```js
//obj-two.js

/* Pull in PropsAware as PA */
const PA = require('@develephant/props-aware')

const ObjB = {
  props: PA.props()
}
module.exports = ObjB
```

__Run__

```js
//main.js

const objA = require('./obj-one')
const objB = require('./obj-two')

objA.listen()

objA.props.greeting = 'Hola' /* ObjA will output "Hola" */

//Props object is "global" so this works via objB:

objB.props.greeting = 'Hello' /* ObjA will output "Hello" */

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
