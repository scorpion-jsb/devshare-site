import { paths } from 'constants'

export default () => ({
  path: paths.signup,
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Signup = require('./containers/SignupContainer').default

      cb(null, Signup)

    /* Webpack named bundle   */
    }, 'Signup')
  }
})
