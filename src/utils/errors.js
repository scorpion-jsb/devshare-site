import Raven from 'raven-js'
import { sentryDsn, env as environment } from 'config'  // eslint-disable-line import/no-unresolved
import { version as release } from '../../package.json'

/**
 * @description Initialize Raven
 */
export const initRaven = () => {
  if (sentryDsn) {
    Raven.config(
      sentryDsn,
      {
        environment,
        release
      }
    ).install()
  }
}

/**
 * @description Set user within Raven (so it will show in Sentry)
 * @param {Object} auth - Authentication information for user
 */
export const setRavenUser = (auth) => {
  if (auth && auth.uid) {
    Raven.setUserContext({
      id: auth.uid,
      email: auth.email || 'none'
    })
  }
}

export default { initRaven, setRavenUser }
