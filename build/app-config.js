/* eslint-disable import/no-extraneous-dependencies */
const _debug = require('debug') // eslint-disable-line no-underscore-dangle
const fs = require('fs')
const path = require('path')
const debug = _debug('app:build:config')
const { version } = require('../package.json')
const firebaseEnvironments = require('../config/firebaseEnvironments')

const {
  TRAVIS_BRANCH,
  SENTRY_DSN,
  GA_TRACKINGID,
  INT_FIREBASE_WEBAPIKEY,
  STAGE_FIREBASE_WEBAPIKEY,
  PROD_FIREBASE_WEBAPIKEY
} = process.env

const createConfigFile = (cb) => {
  let env = 'int'
  let firebase = firebaseEnvironments.int
  firebase.apiKey = INT_FIREBASE_WEBAPIKEY

  switch (TRAVIS_BRANCH) {
    case 'stage':
      env = 'stage'
      firebase = firebaseEnvironments.stage
      firebase.apiKey = STAGE_FIREBASE_WEBAPIKEY
      break
    case 'prod':
      env = 'prod'
      firebase = firebaseEnvironments.prod
      firebase.apiKey = PROD_FIREBASE_WEBAPIKEY
      break
    default:
      // leave int by default
  }

  const outputPath = path.join(__dirname, '..', 'src/config.js')
  const fileString = `export const firebase = ${JSON.stringify(firebase, null, 2)}\n` +
    `\nexport const version = ${JSON.stringify(version)};\n` +
    `\nexport const env = ${JSON.stringify(env)}\n` +
    `\nexport const sentryDsn = ${JSON.stringify(SENTRY_DSN || '')}\n` +
    `\nexport const gaTrackingId = ${JSON.stringify(GA_TRACKINGID || '')}\n` +
    '\nexport default { firebase, env, gaTrackingId }\n'

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
