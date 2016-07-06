/** Configuration Singleton
 */

import { merge } from 'lodash'

let defaultConfig = {
  envs: {
    local: {
      logLevel: 'trace'
    },
    dev: {
      logLevel: 'debug'
    },
    stage: {
      logLevel: 'info'
    },
    prod: {
      logLevel: 'warn'
    }
  }
}
let instance = null
let envName = 'prod'
class Config {
  constructor () {
    if (!instance) {
      instance = this
    }
    return merge(instance, defaultConfig)
  }
  get logLevel () {
    return defaultConfig.envs[envName].logLevel
  }
  set envName (newEnv) {
    envName = newEnv
  }
  get env () {
    return defaultConfig.envs[envName]
  }
  applySettings (settings) {
    merge(instance, settings)
  }
}
let config = new Config()

export default config
