/**
 * Forms
 * @description Redux-form names
 **/
export const formNames = {
  account: 'account'
}

/**
 * Paths
 * @description Locations on Firebase where data is loaded from
 **/
export const firebasePaths = {

}

/**
 * Paths
 * @description These constants are applied in index.js of each route within
 * the routes folder.
 **/
export const paths = {
  home: '/',
  login: '/login',
  signup: '/signup',
  account: '/account',
  projects: '/projects'
}

export default {
  firebasePaths,
  paths,
  formNames
}
