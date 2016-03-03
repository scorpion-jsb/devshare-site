import { isFunction } from 'lodash'

export function event (fields) {
  const { action, category, label, value } = fields
  if (!category || !action) throw new Error('Category and Action are required')
  if (gaExists()) {
    window.ga('send', 'event', category, action, label || null, value || null)
  } else {
    console.debug('Analytics event:', { category, action, label, value })
  }
}

function gaExists () {
  return typeof window !== 'undefined' && isFunction(window.ga)
}
