const PA = require('../lib/PropsAware')
const clog = require('@develephant/clog')

module.exports = class B {
  constructor() {
    this.props = PA.props()
  }

  greet() {
    this.props.greeting = 'Howdy'
  }

  remove() {
    clog.r('del', PA.del('score'))
  }

}
