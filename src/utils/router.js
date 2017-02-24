import { UserAuthWrapper } from 'redux-auth-wrapper'
import { browserHistory } from 'react-router'
import { paths } from 'constants'
import { helpers } from 'redux-devshare'
import LoadingSpinner from 'components/LoadingSpinner'
import { AUTHED_REDIRECT, UNAUTHED_REDIRECT } from 'constants/actionTypes'
const { pathToJS } = helpers

/**
 * @description Higher Order Component that redirects to `/login` instead
 * rendering if user is not authenticated (default of redux-auth-wrapper).
 * @param {Component} componentToWrap - Component to wrap
 * @return {Component} wrappedComponent
 */
export const UserIsAuthenticated = UserAuthWrapper({ // eslint-disable-line new-cap
  wrapperDisplayName: 'UserIsAuthenticated',
  LoadingComponent: LoadingSpinner,
  authSelector: ({ devshare }) => pathToJS(devshare, 'auth'),
  authenticatingSelector: ({ devshare }) =>
    (pathToJS(devshare, 'auth') === undefined) ||
    (pathToJS(devshare, 'isInitializing') === true),
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
  failureRedirectPath: ({ devshare }, props) =>
    props.location.query.redirect || paths.home,
  authSelector: ({ devshare }) => pathToJS(devshare, 'auth'),
  authenticatingSelector: ({ devshare }) =>
    (pathToJS(devshare, 'auth') === undefined) ||
    (pathToJS(devshare, 'profile') === undefined) ||
    (pathToJS(devshare, 'isInitializing') === true),
  predicate: auth => auth === null,
  redirectAction: newLoc => (dispatch) => {
    browserHistory.replace(newLoc)
    dispatch({ type: AUTHED_REDIRECT })
  }
})
