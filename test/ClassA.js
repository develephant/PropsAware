const PA = require('../lib/PropsAware')
const clog = require('@develephant/clog')

module.exports = class A {
  constructor() {
    this.props = PA.props()
    
    PA.on('greeting', (val) => {
      clog.ok(val, this.props.username)
    })

    PA.on('score', (val, prop) => {
      clog.ok(prop, val)
    })

  }

}

