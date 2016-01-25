import {
  TAB_OPEN,
  TAB_CLOSE,
  SET_ACTIVE_TAB
} from '../actions/tabs';
import {merge, union, clone} from 'lodash';
export default function tabs(state = {
}, action) {
  let newState, projectKey;
  switch (action.type) {
  case TAB_OPEN:
    if(!action.project || !action.project.name){
      console.error('Project name needed to open tab');
      return;
    }
    newState = clone(state);
    projectKey = action.project.owner.username ? `${action.project.owner.username}/${action.project.name}` : action.project.name;
    if(!newState[projectKey]){
      newState[projectKey] = {list: [], currentIndex: 0};
    }
    if(!newState[projectKey].list){
      newState[projectKey].list = [];
    }
    if(!newState[projectKey].currentIndex){
      newState[projectKey].currentIndex = 0;
    }
    newState[projectKey].list.push({title: action.title, file: action.payload});
    return merge({}, state, newState); //push would not work
    break;
  case TAB_CLOSE:
    newState = clone(state);
    projectKey = action.project.owner.username ? `${action.project.owner.username}/${action.project.name}` : action.project.name;
    newState[projectKey].list.splice(action.index, 1);
    const newInd = (action.index > 0) ? action.index - 1 : 0;
    newState[projectKey].currentIndex = newInd;
    return merge({}, newState);
    break;
  case SET_ACTIVE_TAB:
    newState = clone(state);
    projectKey = action.project.owner.username ? `${action.project.owner.username}/${action.project.name}` : action.project.name;
    if(!state[projectKey]){
      newState[projectKey] = {};
    }
    newState[projectKey].currentIndex = action.index;
    return merge({}, state, newState);
    break;
  default:
    return state;
  }
}
