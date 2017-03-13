
const ClassA = require('./ClassA')
const ClassB = require('./ClassB')
const Func = require('./Function')
const Obj = require('./Object')

Obj.listen()

Obj.greet('Howdy')

let a1 = new ClassA()

Obj.props.username = 'Marco'

let a2 = new ClassA()

a1.props.greeting = 'Hola'
a2.props.username = 'Sally'

let a3 = new ClassA()

a3.props.greeting = 'Hi'

Func()

delete a3

console.log(a3)

let b = new ClassB()
b.greet()

b.props.score = 100

console.log(b)
console.log(a3)

Func()

b.props.username = 'Fred'
b.props.score = 5000
Obj.greet('Hi Diddly Ho!')

Obj.props.score = 500

b.remove()

console.log(a1.props.score)

a2.props.score = 300

Obj.props.score = 1200
Obj.props.score = 555
Obj.props.score = 555
Obj.props.score = 2300

b.props.thing = {user: 'jim', color: 'red'}
b.props.thing = {user: 'jim', color: 'red'}
b.props.thing = {user: 'jim', color: true}

a2.props.status = false
a2.props.status = false
a2.props.status = true

a1.props.arr = [1,2,3]
a1.props.arr = [1,2,3]
a1.props.arr = [2,3,4]
a1.props.arr = [2, 3, 4]
