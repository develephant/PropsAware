const PA = require('../lib/PropsAware')
const clog = require('@develephant/clog')

module.exports = function() {
  this.props = PA.props()
  this.props.greeting = 'Hola'

  console.log(PA.has('score'))
}