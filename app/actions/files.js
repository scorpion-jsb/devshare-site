import * as TabActions from './tabs';

import { getGrout } from 'redux-grout';

let grout = getGrout();

export const ATTEMPT_OPEN = 'ATTEMPT_OPEN';
export const GET_FILE_REQUEST = 'GET_FILE_REQUEST';
export const GET_FILE_SUCCESS = 'GET_FILE_SUCCESS';
export const GET_FILES_REQUEST = 'GET_FILES_REQUEST';
export const GET_FILES_SUCCESS = 'GET_FILES_SUCCESS';
export const ADD_FILES_REQUEST = 'ADD_FILES_REQUEST';
export const ADD_FILES_SUCCESS = 'ADD_FILES_SUCCESS';
export const SYNC_FILES_REQUEST = 'SYNC_FILES_REQUEST';
export const SYNC_FILES_SUCCESS = 'SYNC_FILES_SUCCESS';
export const ADD_FILE_REQUEST = 'ADD_FILE_REQUEST';
export const ADD_FILE_SUCCESS = 'ADD_FILE_SUCCESS';
export const DELETE_FILE_REQUEST = 'DELETE_FILE_REQUEST';
export const DELETE_FILE_SUCCESS = 'DELETE_FILE_SUCCESS';

export const START_SYNC_EDITOR = 'START_SYNC_EDITOR';
export const FINISH_SYNC_EDITOR = 'FINISH_SYNC_EDITOR';
export const FILES_ERR = 'FILES_ERR';

export function startFileOpen(fileData) {
 return {
   type: ATTEMPT_OPEN,
   payload: fileData
 };
}
export function receiveFile(fileData) {
 return {
   type: GET_FILE_SUCCESS,
   file: fileData
 };
}
export function openFile(openData) {
  // console.log('open file', openData);
  if(!openData.projectName || !openData.file){
    console.error({
      description: 'Project and file data are needed to open file',
      openData: openData
    });
  }
  return (dispatch, getState) => {
    dispatch(startFileOpen(openData));
    let file = grout.App(openData.projectName).File(openData.file);
    console.log({
      description: 'Open file created file.',
      file:file, fbRef: file.fbRef
    });
    file.get().then((file) => {
      let fileRes = {project: openData.projectName , file: file};
      console.log({
        description: 'Open file responded', fileRes: fileRes
      });
      dispatch(receiveFile(fileRes));
    }, (err) => {
      return {type: FILES_ERR, payload: err}
    });
  }
}
export function openFileInTab(openData) {
  if(!openData.projectName || !openData.file){
    console.error({
      description: 'ProjectName and file data are needed to open file in tab',
      openData: openData
    });
  }
  return (dispatch, getState) => {
    dispatch(startFileOpen(openData));
    console.warn('open data:', openData);
    let file = grout.App(openData.projectName).File(openData.file);
    console.log({
      description: 'Open file created file.',
      file:file, fbUrl: file.fbUrl, fbRef: file.fbRef,
    });
    file.get().then((fileRes) => {
      let fileData = {project: openData.projectName , file: fileRes};
      console.log({
        description: 'Open file responded', fileData: fileData
      });
      dispatch(receiveFile(fileRes));
      let tabData = {
        projectName: openData.projectName,
        title: openData.file.name || openData.file.path.split('/')[openData.file.path.split('/').length - 1],
        type: 'file',
        file: file,
        data: {file:file, meta:openData.file}
      };
      dispatch(TabActions.openTab(tabData));
      // dispatch(TabActions.navigateToTab({project: openData.project, index:0}));
    }, (err) => {
        console.error('Error getting file data.', err);
        return {type: FILES_ERR, payload: err}
    });
  }
}

export function startSyncEditor(fileData) {
 return {
   type: START_SYNC_EDITOR,
   payload: fileData
 };
}
export function receiveSyncEditor(editorData) {
 return {
   type: FINISH_SYNC_EDITOR,
   editor: editorData
 };
}
export function syncEditor(openData) {
  console.log('sync editor called')
  if(!openData.projectName || !openData.editor){
    console.error({
      description: 'Project and editor are needed to open sync editor.',
      openData: openData, func: 'syncEditor', file: 'actions/files'
    });
  }
  return (dispatch, getState) => {
    dispatch(startSyncEditor(openData));
    console.debug('open data:', openData);
    let file = grout.App(openData.projectName).File(openData.file);
    console.log({
      description: 'File created.',
      file:file, fbRef: file.fbRef
    });
    try {
      file.get().then((fileWithContent) => {
        let firepad = createFirepad(openData.file.fbRef, openData.editor, {userId: grout.currentUser.username});
        firepad.on('ready', () => {
          let fileRes = {project: openData.projectName , syncedEditor: firepad};
          console.log({
            description: 'Open in firepad responded', fileRes: fileRes
          });
          dispatch(receiveSyncEditor(fileRes));
        });
      })

    } catch(err) {
      // console.error('Error creating firepad', err);
      // return {type: FILES_ERR, payload: err};
    }
  }
}
/**
 * @description File Hierarchy Actions
 */
export function startLoadFiles(filesData) {
 return {
   type: GET_FILES_REQUEST,
   projectName: filesData.projectName
 };
}
export function receiveFiles(filesRes) {
 return {
   type: GET_FILES_SUCCESS,
   projectName: filesRes.projectName,
   files: filesRes.files || []
 };
}
export function loadFiles(projectData) {
  if(!projectData.projectName){
    console.error({
      description: 'ProjectName is required to load files.',
      fileData: fileData
    });
    return {type: FILES_ERR, payload: {message: 'ProjectName and path required to add file.'}};
  }
  return (dispatch, getState) => {
    dispatch(startLoadFiles(projectData));
    grout.App(projectData.projectName).Files.buildStructure().then((fileStructure) => {
      let filesRes = {files:fileStructure, projectName: projectData.projectName};
      dispatch(receiveFiles(filesRes));
    }, (err) => {
      return {type: FILES_ERR, payload: err}
    });
  }
}
export function startSyncFiles(filesData) {
 return {
   type: SYNC_FILES_REQUEST,
   projectName: filesData.projectName
 };
}
export function finishSyncFiles(filesRes) {
 return {
   type: SYNC_FILES_SUCCESS,
   projectName: filesRes.projectName,
   files: filesRes.files || []
 };
}
export function syncFiles(projectData) {
  if(!projectData.projectName){
    console.error({
      description: 'ProjectName is required to load files.',
      fileData: fileData
    });
    return {type: FILES_ERR, payload: {message: 'ProjectName and path required to add file.'}};
  }
  return (dispatch, getState) => {
    dispatch(startSyncFiles(projectData));
    grout.App(projectData.projectName).Files.syncStructure().then((fileStructure) => {
      let filesRes = {files:fileStructure, projectName: projectData.projectName};
      dispatch(finishSyncFiles(filesRes));
    }, (err) => {
      return {type: FILES_ERR, payload: err}
    });
  }
}
export function startAddFile(filesData) {
 return {
   type: ADD_FILE_REQUEST,
   projectName: filesData.projectName
 };
}
export function finishAddFile(filesRes) {
 return {
   type: ADD_FILE_SUCCESS,
   projectName: filesRes.projectName,
   file: filesRes.file
 };
}
export function addFile(fileData) {
  if(!fileData.projectName || !fileData.path){
    console.error({
      description: 'ProjectName and path required to add file.',
      fileData: fileData
    });
    return {type: FILES_ERR, payload: {message: 'ProjectName and path required to add file.'}};
  }
  return (dispatch, getState) => {
    dispatch(startAddFile(fileData));
    grout.App(fileData.projectName).Files.add({path: fileData.path}).then((fileStructure) => {
      let filesRes = {file:fileStructure, projectName: fileData.projectName};
      dispatch(finishAddFile(filesRes));
    }, (err) => {
      return {type: FILES_ERR, payload: err}
    });
  }
}


export function startAddFiles(filesData) {
 return {
   type: ADD_FILE_REQUEST,
   projectName: filesData.projectName
 };
}
export function finishAddFiles(filesRes) {
 return {
   type: ADD_FILE_SUCCESS,
   projectName: filesRes.projectName,
   file: filesRes.file
 };
}
export function addFiles(filesData) {
  if(!filesData.projectName || !filesData.files){
    console.error({
      description: 'ProjectName and path required to add file.', filesData
    });
    return {type: FILES_ERR, payload: {message: 'ProjectName and path required to add file.'}};
  }
  return (dispatch, getState) => {
    dispatch(startAddFiles(filesData));
    grout.App(filesData.projectName).Files.add(filesData.files).then((fileStructure) => {
      let filesRes = {file:fileStructure, projectName: filesData.projectName};
      dispatch(finishAddFiles(filesRes));
    }, (err) => {
      return {type: FILES_ERR, payload: err}
    });
  }
}
