
const { EventEmitter } = require('events')

const Props = {}
const Dispatcher = new EventEmitter()

const PAProxyObj = {
  set(target, prop, val) {
    target[prop] = val
    Dispatcher.emit(prop, val, prop)
    Dispatcher.emit('*', prop, val)
    return true
  }
}

const PAProxy = new Proxy(Props, PAProxyObj)

const PropsAware = {
  del(prop) {
    if (prop in Props) {
      Dispatcher.removeAllListeners(prop)
      Dispatcher.emit('del', prop, Props[prop])
      delete Props[prop]
      return true
    }
    return false
  },
  has(prop) {
    return prop in Props
  },
  on(prop, cb) {
    return Dispatcher.on(prop, cb)
  },
  onAll(cb) {
    return Dispatcher.on('*', cb)
  },
  onDel(cb) {
    return Dispatcher.on('del', cb)
  },
  props() {
    return PAProxy
  }
}

// ^_^ pew-pew...
module.exports = PropsAware