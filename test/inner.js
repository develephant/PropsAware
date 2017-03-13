const PA = require('../lib/PropsAware')

let props = PA.props()

PA.onAll((val, prop) => {
  console.log(val)
  setTimeout(() => { props[prop] = val }, 1)
})

PA.on('username', (val) => {
  console.log(val)
  props.username = 'Tacoo'
})

props.username = 'Fido'
