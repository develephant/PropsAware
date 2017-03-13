
const { EventEmitter } = require('events')
const hasha = require('hasha')

const PropState = new Map()

const Props = {}
const Dispatcher = new EventEmitter()

function genPropState(val) {
  return hasha(JSON.stringify(val))
}

const PAProxyObj = {
  set(target, prop, val) {
    let emit = false

    //generate a 'hash' of the state
    let prop_state = genPropState(val)
    if (PropState.has(prop)) {

      let cached_state = PropState.get(prop)
      if (prop_state === cached_state) {
        //cached
        return true
      } else {
        PropState.set(prop, prop_state)
        target[prop] = val
        emit = true
      }
    } else {
      //add new state
      PropState.set(prop, prop_state)
      target[prop] = val 
      emit = true
    }

    //emit?
    if (emit === true) {
      emit = false
      //dispatch the new data
      Dispatcher.emit(prop, val, prop)
      Dispatcher.emit('*', val, prop)
    }

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
    return true
  },
  sync() {
    for (prop in Props) {
      if (prop !== null) {
        let val = Props[prop]
        Dispatcher.emit(prop, val, prop)
        Dispatcher.emit('*', val, prop)
      }
    }
    return true
  }
}

// ^_^ pew-pew...
module.exports = PropsAware