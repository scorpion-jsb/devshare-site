import React from 'react'
import ReactDOM from 'react-dom'
import { initScripts } from 'utils'
import createStore from './store/createStore'
import AppContainer from './containers/App/App'
import { version } from '../package.json'
import config, { env } from './config'

// ========================================================
// Set Window Variables
// ========================================================
window.version = version
window.env = env
window.config = config
initScripts()

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.___INITIAL_STATE__ || { firebase: { authError: null } } // eslint-disable-line no-underscore-dangle
const store = createStore(initialState)

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

let render = () => {
  const routes = require('./routes/index').default(store) // eslint-disable-line global-require

  ReactDOM.render(
    <AppContainer store={store} routes={routes} />,
    MOUNT_NODE
  )
}

// ========================================================
// Developer Tools Setup
// ========================================================
if (__DEV__) {
  if (window.devToolsExtension) {
    // window.devToolsExtension.open()
  }
}

// This code is excluded from production bundle
if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default // eslint-disable-line

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// ========================================================
// Go!
// ========================================================
render()
