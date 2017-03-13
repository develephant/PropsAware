
const { EventEmitter } = require('events')

const Props = {}
const Dispatcher = new EventEmitter()

const PAProxyObj = {
  set(target, prop, val) {
    target[prop] = val
    Dispatcher.emit(prop, val, prop)
    Dispatcher.emit('*', val, prop)
    return true
  }
}

const PAProxy = new Proxy(Props, PAProxyObj)

const PropsAware = {
  del(prop) {
    if (prop in Props) {
      Dispatcher.removeAllListeners(prop)
      Dispatcher.emit('del', Props[prop], prop)
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
  },
  set(prop, val) {
    Props[prop] = val
  },
  sync() {
    for (prop in Props) {
      if (prop !== null) {
        let val = Props[prop]
        Dispatcher.emit(prop, val, prop)
        Dispatcher.emit('*', val, prop)
      }
    }
  }
}

// ^_^ pew-pew...
module.exports = PropsAware