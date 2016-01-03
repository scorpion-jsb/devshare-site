export const WORKSPACE_SELECT = 'WORKSPACE_SELECT';
export const WORKSPACE_START = 'WORKSPACE_START';
export const WORKSPACE_CLOSE = 'WORKSPACE_CLOSE';
export const WORKSPACE_ERR = 'WORKSPACE_ERR';

export function startWorkspace(workspaceData) {
  console.log('start workspace called', workspaceData);
 return {
   type: WORKSPACE_START,
   name: workspaceData.name,
   project: workspaceData.project
 };
}
export function closeWorkspace(workspaceName) {
 return {
   type: WORKSPACE_CLOSE,
   name: workspaceName
 };
}
export function selectWorkspace(workspaceName) {
 return {
   type: WORKSPACE_SELECT,
   name: workspaceName
 };
}
