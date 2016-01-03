export const ADD_PANE = 'ADD_PANE';
export const CLOSE_PANE = 'CLOSE_PANE';
export const PANES_ERR = 'PANES_ERR';

export function closePane(paneData) {
 return {
  type: CLOSE_PANE,
  workspace: paneData.workspace
 };
}
export function addPane(paneData) {
 return {
  type: ADD_PANE,
  workspace: paneData.workspace
 };
}
