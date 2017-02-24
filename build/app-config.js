/* eslint-disable import/no-extraneous-dependencies */
const _debug = require('debug') // eslint-disable-line no-underscore-dangle
const fs = require('fs')
const path = require('path')

const debug = _debug('app:build:config')
const {
  TRAVIS_BRANCH,
  SENTRY_DSN,
  GA_TRACKINGID
} = process.env

const createConfigFile = (cb) => {
  let env = 'int'

  switch (TRAVIS_BRANCH) {
    case 'stage':
      env = 'stage'
      break
    case 'prod':
      env = 'prod'
      break
    default:
      // leave int by default
  }

  const outputPath = path.join(__dirname, '..', 'src/config.js')
  const fileString =
    `\nexport const env = ${JSON.stringify(env)}\n` +
    `\nexport const sentryDsn = ${JSON.stringify(SENTRY_DSN || '')}\n` +
    `\nexport const gaTrackingId = ${JSON.stringify(GA_TRACKINGID || '')}\n` +
    '\nexport default { env, gaTrackingId }\n'

  fs.writeFile(outputPath, fileString, 'utf8', (err) => { // eslint-disable-line consistent-return
    if (err) {
      return debug('Error writing config file:', err)
    }
    if (cb) {
      cb()
    }
  })
}

(function () { // eslint-disable-line func-names
  createConfigFile(() => {
    debug('Config file successfully written to src/config.js')
  })
}())
