import ReactGA from 'react-ga'
import { gaTrackingId, env } from 'config'  // eslint-disable-line import/no-unresolved

// Initialize Google Analytics
export const initGA = () => {
  if (gaTrackingId && env === 'prod') {
    ReactGA.initialize(gaTrackingId)
  }
}

export const setGAUser = (auth) => {
  if (auth && auth.uid) {
    ReactGA.set({ userId: auth.uid })
  }
}

export const trackRouteUpdate = () => {
  if (gaTrackingId && env === 'prod') {
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
  }
}

export default { initGA, trackRouteUpdate }
