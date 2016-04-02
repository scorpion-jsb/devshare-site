import { isFunction } from 'lodash'

export function event (fields) {
  const { action, category, label, value } = fields
  if (!category || !action) throw new Error('Category and Action are required')
  if (gaExists() && !isLocal()) return window.ga('send', 'event', category, action, label || null, value || null)
  console.debug('Would Be Analytics event:', { category, action, label, value })
}

function gaExists () {
  return typeof window !== 'undefined' && isFunction(window.ga)
}

function isLocal () {
  return typeof window !== 'undefined' && window.location.hostname === 'localhost'
}
