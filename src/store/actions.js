export const ADD_ANNOTATION = 'ADD_ANNOTATION';
export const EDIT_ANNOTATION = 'EDIT_ANNOTATION';
export const DELETE_ANNOTATION = 'DELETE_ANNOTATION';
export const SET_VIDEO_ID = 'SET_VIDEO_ID';
export const SET_CURRENT_TIME = 'SET_CURRENT_TIME';

export const addAnnotation = (videoId, annotation) => ({
  type: ADD_ANNOTATION,
  payload: { videoId, annotation },
});

export const editAnnotation = (videoId, id, note) => ({
  type: EDIT_ANNOTATION,
  payload: { videoId, id, note },
});

export const deleteAnnotation = (videoId, id) => ({
  type: DELETE_ANNOTATION,
  payload: { videoId, id },
});

export const setVideoId = (videoId) => ({
  type: SET_VIDEO_ID,
  payload: videoId,
});

export const setCurrentTime = (videoId, time) => ({
  type: SET_CURRENT_TIME,
  payload: { videoId, time },
});
