import config from '../config'
import {
	has, each, isObject,
	keys, omit, isString
} from 'lodash'

// Set default log level to debug
let logLevel = 'debug'

let logger = {
  log (logData) {
    const msgArgs = buildMessageArgs(logData)
    if (config.envName === 'production') return runConsoleMethod('log', msgArgs)
    runConsoleMethod('log', msgArgs)
  },

  info (logData) {
    const msgArgs = buildMessageArgs(logData)
    if (config.envName === 'production') return runConsoleMethod('info', msgArgs)
    runConsoleMethod('info', msgArgs)
  },

  warn (logData) {
    const msgArgs = buildMessageArgs(logData)
    if (config.envName === 'production') return runConsoleMethod('warn', msgArgs)
    runConsoleMethod('warn', msgArgs)
  },

  debug (logData) {
    const msgArgs = buildMessageArgs(logData)
    runConsoleMethod('debug', msgArgs)
  },

  error (logData) {
    const msgArgs = buildMessageArgs(logData)
    if (config.envName === 'production') return runConsoleMethod('error', msgArgs)
    runConsoleMethod('error', msgArgs)
  }
}

export default logger

function runConsoleMethod (methodName, methodData) {
  // Safley run console methods or use console log
  if (methodName && console[methodName]) {
    return console[methodName].apply(console, methodData)
  } else {
    return console.log.apply(console, methodData)
  }
}

function buildMessageArgs (logData) {
  let msgStr = ''
  let msgObj = {}
  // TODO: Attach time stamp
  // Attach location information to the beginning of message
  if (isObject(logData)) {
    if (logLevel === 'debug') {
      if (has(logData, 'func')) {
        if (has(logData, 'obj')) {
          // Object and function provided
          msgStr += `[${logData.obj}.${logData.func}()]\n `
        } else if (has(logData, 'file')) {
          msgStr += `[${logData.file} > ${logData.func}()]\n `
        } else {
          msgStr += `[${logData.func}()]\n `
        }
      }
    }
    // Print each key and its value other than obj and func
    each(omit(keys(logData)), (key, ind, list) => {
      if (key !== 'func' && key !== 'obj') {
        if (key === 'description' || key === 'message') {
          msgStr += logData[key]
        } else if (isString(logData[key])) {
          // msgStr += key + ': ' + logData[key] + ', '
          msgObj[key] = logData[key]
        } else {
          // Print objects differently
          // msgStr += key + ': ' + logData[key] + ', '
          msgObj[key] = logData[key]
        }
      }
    })
    msgStr += '\n'
  } else if (isString(logData)) {
    msgStr = logData
  }
  const msg = [msgStr, msgObj]

  return msg
}
