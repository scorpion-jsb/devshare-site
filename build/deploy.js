import _debug from 'debug'
const debug = _debug('app:build:deploy')
const exec = require('child_process').exec
const { TRAVIS_BRANCH, TRAVIS_PULL_REQUEST, FIREBASE_TOKEN } = process.env
const appNames = {
  development: 'devshare-stg',
  production: 'devshare-1'
}
let appName

const deployToFirebase = (cb) => {
  if (TRAVIS_BRANCH && TRAVIS_BRANCH !== 'master' && TRAVIS_BRANCH !== 'prod') {
    debug('Skipping Firebase Deploy - Branch is not master or prod.')
    process.stdout.write('Skipping Firebase Deploy - Branch is not master.')
    if (cb) cb(null)
    return process.exit()
  }
  if (!!TRAVIS_PULL_REQUEST && TRAVIS_PULL_REQUEST === true) {
    debug('Skipping Firebase Deploy - Build is a Pull Request')
    process.stdout.write('Skipping Firebase Deploy - Build is a Pull Request')
    if (cb) cb(null)
    return process.exit()
  }
  if (!FIREBASE_TOKEN) {
    debug('Error: FIREBASE_TOKEN env variable not found')
    process.stderr.write('Skipping Firebase Deploy - Build is a Pull Request')
    cb('Error: FIREBASE_TOKEN env variable not found', null)
    return process.exit(1)
  }

  if (TRAVIS_BRANCH && TRAVIS_BRANCH === 'prod') {
    appName = appNames.production
  } else {
    appName = appNames.development
  }

  debug(`Deploying to Firebase with name ${appName}...`)
  exec(`firebase use ${appName}`, (err, out) => {
    if (err !== null) {
      debug('error setting firebase appname ', err)
      process.stderr.write(JSON.stringify(err))
      if (cb) cb(err)
      return process.exit(1)
    }
    debug(`sucessfully set Firebase app: ${appName}. Deploying...`)
    process.stdout.write(out)
    exec(`firebase deploy --token ${FIREBASE_TOKEN}`, (error, stdout) => {
      if (error !== null) {
        debug('error uploading to Firebase url: ', error)
        process.stderr.write(JSON.stringify(error))
        if (cb) cb(error)
        return process.exit(1)
      }
      process.stdout.write(stdout)
      if (cb) cb(null)
      process.exit()
    })
  })
}

;(async function () {
  deployToFirebase(() => {
    debug('Successfully deployed to Firebase')
  })
})()
