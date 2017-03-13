const PA = require('../lib/PropsAware')

let props = PA.props()

PA.on('cow', (val) => {
  console.log(val)
})

PA.on('greeting', (val) => {
  console.log(val)
  PA.set('greeting', 'Yo')
  // setTimeout(() => { props.greeting = 'Yo' }, 1)
})

PA.onAll((val, prop) => {
  console.log(prop, val)
})

props.greeting = 'Hello'

PA.sync()