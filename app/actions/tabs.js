export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB';
export const TAB_OPEN = 'TAB_OPEN';
export const TAB_CLOSE = 'TAB_CLOSE';
export const ATTEMPT_OPEN = 'ATTEMPT_OPEN';
export const RECEIVE_FILE = 'RECEIVE_FILE';
export const TAB_ERR = 'TAB_ERR';

export function navigateToTab(tabData) {
  // console.log('navigate to tab called with', tabData);
 return {
   type: SET_ACTIVE_TAB,
   index: tabData.index || 0,
   projectName: tabData.projectName
 };
}
export function closeTab(tabData) {
  // console.log('close tab called with', tabData);
 return {
   type: TAB_CLOSE,
   index: tabData.index,
   projectName: tabData.projectName
 };
}
export function openTab(tabData) {
 return {
   type: TAB_OPEN,
   title: tabData.title,
   tabType: tabData.type || 'file',
   projectName: tabData.projectName,
   payload: tabData.file || tabData.data || {}
 };
}
export function openContentInTab(tabData) {
 return {
   type: TAB_OPEN,
   title: tabData.title,
   tabType: tabData.type || 'file',
   projectName: tabData.projectName,
   payload: tabData.data || tabData.file || {}
 };
}
