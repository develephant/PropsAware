# `PropsAware`

### A "living" global properties data store. Dispatch with ease.

## Install

```
npm i @develephant/props-aware --save
```

## Usage

```js
const PropsAware = require('@develephant/props-aware')
```

# Overview

__PropsAware__ (or `PA`) is a global property object that emits events on property changes.

You can listen for these changes virtually anywhere in your program. 

_Events are only emitted when the underlying property data changes._

In code it looks like this:

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

props.score = 500 //will trigger an update

/* fileone.js will output 500 */

props.score = 500 //will not trigger an update, same data

```

# Discussion

Some things to consider before, or when using __PropsAware__:

  - Only properties are managed; strings, numbers, booleans, arrays, and "data" objects.
  - Properties are stored as a flat tree. Only root keys trigger update events. [1]
  - When you set a `PA` property, its immediately available to all listeners.
  - Callbacks are set on the `PropsAware` (`PA`) object directly, _not_ the property itself. [2]
  - To change a property without emitting an update event, use `PA.set(p, v)`.
  - Limit yourself to a handful of base `PA` properties, and pass primitives for flow control.
  - There are no guarantees on delivery order or timing. it will get there though.
  - When creating object instances with `PA` properties, each instance will have its own listener. [3]
  - Dont set `PA` properties in an `onAll` handler. [4]

### Footnotes

#### 1) Only root keys trigger an update:

```js
//example PA props object
...
let props = {
  score: 200
  user: {
    name: 'User',
    color: 'green'
  }
}
```

In the code above, when the `score` property is updated with a _new_ value, an event will be emitted.

The `user` key holds an object. When the key is set with an updated object, the `user` key will trigger:

```js
//only root keys emit
PA.on('user', (val) => {
  console.log(val.color) //blue
})

props.user = { color: 'blue' }

```

Changing `user.color` directly will not trigger an event. The objects "shape" must change. Additionally, in the code above, the `name` key will be stripped away. This may be fine if thats whats intended.

An easy way to handle this, is pulling the object first:

```js
let obj = props.user
obj.color = 'yellow'
props.user = obj

//yellow
```

> ___The above holds true for Arrays too.___

#### 2) Callbacks are set on the `PA` object, _not_ the property:

```js
...
//Works!
PA.on('score', (val) => {
  console.log(val)
})

//Does NOT work
score.on((val) => {
  console.log(val)
}

```

#### 3) Created instances of a Class will all emit:

```js
class MyClass {
  constructor() {
    this.props = PA.props()
    PA.on('score', (val) => {
      console.log(val)
    })
  }
}

const instance1 = new MyClass()
const instance2 = new MyClass()
const instance3 = new MyClass()

instance1.props.score = 100

/* instance1 outputs 100 */
/* instance2 outputs 100 */
/* instance3 outputs 100 */
```

#### 4) Dont set properties in an `onAll` handler:

```js
//infinite loop
let props = PA.props()
PA.onAll((val, prop) => {
  props[prop] = val //dont do it!
  props.dontsetme = 'oops' //think of the puppies!!
})
```

If you _really, really_ need to set a `PA` property in an `onAll` handler you can either:

___Set it silently, without triggering an update___

```js
let props = PA.props()
PA.onAll((val, prop) => {
  PA.set(prop, val) //does not emit
})
```

Or, you can use this workaround/hack:

```js
let props = PA.props()
PA.onAll((val, prop) => {
  setTimeout(() => { props[prop] = val }, 1)
  //will run until your computer starts smoking
})
```

But, at the end of the day, thats an infinite loop. Its not advisable.

# Keep it simple

Try to keep the amount of __PropsAware__ properties to a minimum. Pass strings, numbers, and booleans to handle messaging and state.

Consider the following:

```js
const PA = require('@develephant/props-aware')
let props = PA.props()

//this is okay...
props.walking = true
props.running = false

//but this is better!
props.pace = 'walking'
//OR
props.pace = 'running'

```

> _In most basic programs, you shouldnt need more than 4-5 `PA` properties._
>
> With the pattern above, its entirely possible to manipulate the bulk of your program with one `PA` property!

# API

## `props() -> PropsAware_properties`

Retreives the __PropsAware__ property object. All properties on this object emit when set.

```js
const PA = require('@develephant/props-aware')

let props = PA.props()
```

## `on(prop, cb)`

__Callback receives:__

|Name|Purpose|
|----|-------|
|`val`|The property value|
|`prop`|The name of the property|

Listen for a property update.

```js
const PA = require('@develephant/props-aware')

PA.on('score', (val, prop) => {
  console.log(val)
})
```


## `has(prop) -> success_bool`

Checks to see if a specific __root__ property is housed in the __PropsAware__ property table.

```js
const PA = require('@develephant/props-aware')

let has_username = PA.has('username')
```

## `del(prop) -> success_bool`

Removes a properties update listeners. This destroys __all__ update listeners for the property, except the global `onAll`.

```js
let success = PA.del('score')
```

## `onAll(cb)`

__Callback receives:__

|Name|Purpose|
|----|-------|
|`val`|The property value|
|`prop`|The name of the property|

Any part of the program can listen for __all__ `PA` property changes. When using this method, you need to filter the messages with control statements.

```js
PA.onAll((val, prop) => {
  console.log('changed', prop, val)
})
```

_Property based flow control:_

```js
PA.onAll((val, prop) => {
  if (prop === 'goback') {
    console.log('go back')
  } else if (prop === 'goforward') {
    console.log('go forward')
  }
})

//...somewhere else

/* PA Props reference */
let props = PA.props()
props.goback = true
//...or
props.goforward = true

```

_State based flow control (using `on`):_

```js
PA.on('state', (val) => {
  if (val === 'goback') {
    console.log('go back')
  } else if (val === 'goforward') {
    console.log('go forward')
  }
})

//...somewhere else

/* PA Props reference */
let props = PA.props()
props.state = 'goback'
//...or
props.state = 'goforward'
```

> _State based flow control is generally the better choice._ 
> 
> With the pattern above, its entirely possible to manipulate the bulk of your program with one `PA` property!

## `onDel(cb)`

__Callback receives:__

|Name|Purpose|
|----|-------|
|`prop`|The name of the property|

Fired when the `del` method is used in the __PropsAware__ object

```js
PA.onDel((prop) => {
  console.log('del', prop)
})
```

## `sync() --> success_bool`

Dispatch all properties, to all listeners. Should not be used often, especially with large property objects.

> _Note:_ Any `onAll` listeners will be called with __all__ emitted properties.

```js
const PA = require('@develephant/props-aware')

//Set a property "silently"
PA.set('prop', 'val')

//Nevermind, resend everything
PA.sync()
```

# Examples

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

^_^

---

#### `PropsAware` &Star; &copy; 2017 develephant &Star; Apache-2.0 license
