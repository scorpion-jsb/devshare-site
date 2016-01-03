import {
  TAB_OPEN,
  TAB_CLOSE,
  SET_ACTIVE_TAB
} from '../actions/tabs';
import {merge, union, clone} from 'lodash';
export default function tabs(state = {
}, action) {
  switch (action.type) {
  case TAB_OPEN:
    //TODO: Use another method that doesn't directly modifiy state
    if(!action.projectName){
      console.error('Project name needed to open tab');
    }
    let newState = clone(state);
    if(!newState[action.projectName]){
      newState[action.projectName] = {};
    }
    if(!newState[action.projectName].list){
      newState[action.projectName].list = [];
    }
    if(!newState[action.projectName].currentIndex){
      newState[action.projectName].currentIndex = 0;
    }
    newState[action.projectName].list.push({title: action.title, file: action.payload});
    return merge({}, state, newState); //push would not work
    break;
  case TAB_CLOSE:
    //TODO: Use another method that doesn't directly modifiy state
    // console.log('tab close called with', action);
    let stateWithoutTab = clone(state);
    stateWithoutTab[action.projectName].list.splice(action.index, 1);
    let newInd = (action.index > 0) ? action.index - 1 : 0;
    stateWithoutTab[action.projectName].currentIndex = newInd;
    return merge({}, stateWithoutTab);
    break;
  case SET_ACTIVE_TAB:
    //TODO: Use another method that doesn't directly modifiy state
    let changedState = clone(state);
    if(!state[action.projectName]){
      changedState[action.projectName] = {};
    }
    changedState[action.projectName].currentIndex = action.index;
    console.log('changed state in set active tab', changedState);
    return merge({}, state, changedState);
    break;
  default:
    return state;
  }
}
