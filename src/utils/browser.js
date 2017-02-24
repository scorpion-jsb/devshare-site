import MobileDetect from 'mobile-detect'

/**
 * @description Detect if application is running in standalone mode
 * @return {Boolean}
 */
export const isStandalone = () => {
  const md = new MobileDetect(window.navigator.userAgent)
  return md.os() === 'iOS' && window.navigator.standalone
}

export default { isStandalone }
