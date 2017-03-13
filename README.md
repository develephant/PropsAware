# `PropsAware`

### A "living" global properties store for Node based programs. Dispatch with ease.

## Install

```
npm i @develephant/props-aware --save
```

## Usage

```js
const PropsAware = require('@develephant/props-aware')
```

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

# Gotchas

Some things to consider before, or when using __PropsAware__:

  - All properties are stored in a "flat" object. Only root keys trigger update events. [1]
  - When you set a PA property, it overwrites the existing value for all listeners.
  - You can store objects with nested values, but you cant trigger on inner keys.
  - Callbacks are set on the `PropsAware` (`PA`) object directly, _not_ the property itself. [2]
  - To change a property without emitting an update event, use `PA.set(p, v)`.
  - Dont set the same property in a properties matching callback. Use `PA.set(p, v)`.
  - Never set properties in the `onAll` callback (see below for workarounds).
  - Limit yourself to a handful of base `PA` properties, and pass strings for flow control.
  - There are no guarentees on delivery order or timing. it will get there though.
  - When creating object instance with PA properties, each instance will have a listener attached. [3]

### Footnotes

#### 1) Only root keys trigger an update:

```js
//example PA props object
...
{
  score: 200 //Will emit
  user: { //Will emit
    name: 'User', //Will NOT emit
    color: 'green' //Will NOT emit
  }
}
```

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

# API

## `props()`

Retreives the __PropsAware__ property object. All properties on this object emit when set.

```js
const PA = require('@develephant/props-aware')

let props = PA.props()
```

## `on(prop, cb)`

__Callback:__

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


## `has(prop)`

Checks to see if a specific property is housed in the __PropsAware__ property table.

```js
const PA = require('@develephant/props-aware')

let has_username = PA.has('username')
```

## `del(prop)`

Removes a properties update listeners. This destroys __all__ update listeners for the property, except the global `onAll`.

```js
let success = PA.del('score')
```

## `onAll(cb)`

__Callback:__

|Name|Purpose|
|----|-------|
|`val`|The property value|
|`prop`|The name of the property|

Your program can opt-in to listening to __all__ property changes. When using this method, you would need to filter the messages you want.

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
props.state = 'goback'
//...or
props.state = 'goforward'


```

## `onDel(cb)`

__Callback:__

|Name|Purpose|
|----|-------|
|`prop`|The name of the property|

Fired when the `del` method is used in the __PropsAware__ object

```js
PA.onDel((prop) => {
  console.log('del', prop)
})
```

## `sync()`

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

# Tips

## Keep it simple

Try to keep the amount of __PropsAware__ properties to a minimum, and instead pass strings, etc. to handle different messaging and state.

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

> In most basic programs, you can usually get away with less than 5-6 __PropsAware__ properties.

## Don't set the same property in a property callback.

Because, Stack Overflow...

```js
//Will NOT work
let props = PA.props()
PA.on('score', (val) => {
  props.score = 200 //infinite loop!
})


//Will work
PA.on('score', (val) => {
  props.someotherprop = 'winning'
})

```

## Don't set properties in `onAll`.

See previous tip...

```js
let someprop
let props = PA.props()

PA.onAll((val, prop) => {
  //if props.prop === prop 
  props.prop = someval //infinite loop!
  //non PA property
  someprop = someval //this is fine
})

```

### Workarounds

If you really need to set a property in the properties callback, you can either set it silently, without triggering an update, or by setting a super short timeout.

But, in reality this creating an infinite loop, so you need to make sure you can break out of it.

___The issue:___

```js
...
let props = PA.props()
PA.on('score', (val) => {
  props.score = 300
  /* Will repeat until stack overflow */
})
```

___Set a property "silently":___

```js
...

PA.on('score', (val) => {
  PA.set('score', new_val)
})

```

If you really, really, want to loop in the callback, you can use this trick:

```js
...

let props = PA.props()
PA.on('score', (val) => {
  setTimeout((val) => { props.score = val }, 1)
  /* Will loop forever, or until your computer fizzles */
})
```


^_^

---

#### `PropsAware` &Star; &copy; 2017 develephant &Star; Apache-2.0 license
