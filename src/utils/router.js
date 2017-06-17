import { UserAuthWrapper } from 'redux-auth-wrapper'
import { browserHistory } from 'react-router'
import { paths } from 'constants'
import { pathToJS } from 'react-redux-firebase'
import { env } from 'config'  // eslint-disable-line import/no-unresolved
import LoadingSpinner from 'components/LoadingSpinner'
import { AUTHED_REDIRECT, UNAUTHED_REDIRECT } from 'constants/actionTypes'
import { trackRouteUpdate } from './analytics'

/**
 * @description Higher Order Component that redirects to `/login` instead
 * rendering if user is not authenticated (default of redux-auth-wrapper).
 * @param {Component} componentToWrap - Component to wrap
 * @return {Component} wrappedComponent
 */
export const UserIsAuthenticated = UserAuthWrapper({ // eslint-disable-line new-cap
  wrapperDisplayName: 'UserIsAuthenticated',
  LoadingComponent: LoadingSpinner,
  authSelector: ({ firebase }) => pathToJS(firebase, 'auth'),
  authenticatingSelector: ({ firebase }) =>
    (pathToJS(firebase, 'auth') === undefined) ||
    (pathToJS(firebase, 'isInitializing') === true),
  predicate: auth => auth !== null,
  redirectAction: newLoc => (dispatch) => {
    browserHistory.replace(newLoc)
    dispatch({
      type: UNAUTHED_REDIRECT,
      payload: { message: 'User is not authenticated.' }
    })
  }
})

/**
 * @description Higher Order Component that redirects to listings page or most
 * recent route instead rendering if user is not authenticated. This is useful
 * routes that should not be displayed if a user is logged in, such as the
 * login route.
 * @param {Component} componentToWrap - Component to wrap
 * @return {Component} wrappedComponent
 */
export const UserIsNotAuthenticated = UserAuthWrapper({ // eslint-disable-line new-cap
  wrapperDisplayName: 'UserIsNotAuthenticated',
  allowRedirectBack: false,
  LoadingComponent: LoadingSpinner,
  failureRedirectPath: ({ firebase }, props) => paths.home,
  authSelector: ({ firebase }) => pathToJS(firebase, 'auth'),
  authenticatingSelector: ({ firebase }) =>
    (pathToJS(firebase, 'auth') === undefined) ||
    (pathToJS(firebase, 'profile') === undefined) ||
    (pathToJS(firebase, 'isInitializing') === true),
  predicate: auth => auth === null,
  redirectAction: newLoc => (dispatch) => {
    browserHistory.replace(newLoc)
    dispatch({ type: AUTHED_REDIRECT })
  }
})

/**
 * @description Fired when route is updated. Route updates are tracked if
 environment is production
 */
export const handleRouteUpdate = () => {
  if (env === 'prod') {
    trackRouteUpdate()
  }
}
