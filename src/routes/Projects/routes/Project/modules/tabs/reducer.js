import {
  TAB_OPEN,
  TAB_CLOSE,
  SET_ACTIVE_TAB
} from './constants'

import { fromJS } from 'immutable'

const initialState = fromJS({})

export default function tabs (state = initialState, { type, project, payload, title, index }) {
  switch (type) {
    case TAB_OPEN:
      if (project && project.name) {
        const projectKey = project.owner
          ? `${project.owner}/${project.name}`
          : project.name

        const stateWithTab = state.getIn([projectKey, 'list'])
          ? [
            ...state.getIn([projectKey, 'list']).toJS(),
              { title, file: payload }
          ]
          : [
              { title, file: payload }
          ]
        return state.setIn(
          [ projectKey, 'list' ],
          fromJS(stateWithTab)
        )
      }
      return state
    case TAB_CLOSE:
      return state.deleteIn([`${project.owner}/${project.name}`, 'list', index])
    case SET_ACTIVE_TAB:
      return state.setIn([`${project.owner}/${project.name}`, 'currentIndex'], index)
    default:
      return state
  }
}
