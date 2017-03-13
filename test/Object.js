const PA = require('../lib/PropsAware')
const clog = require('@develephant/clog')

module.exports = {
  props: PA.props(),
  listen() {
    PA.onAll((prop, val) => {
      clog.y(prop, val)
    })

    PA.onDel((prop) => {
      clog.m('deleted', prop)
    })
  },
  greet(greeting) {
    this.props.greeting = greeting
  }
}