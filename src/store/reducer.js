import { ADD_ANNOTATION, EDIT_ANNOTATION, DELETE_ANNOTATION, SET_VIDEO_ID, SET_CURRENT_TIME } from './actions';

const initialState = {
  currentTime: {},
  videos: {},
  videoId: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ANNOTATION:
      return {
        ...state,
        videos: {
          ...state.videos,
          [action.payload.videoId]: {
            ...state.videos[action.payload.videoId],
            annotations: [
              ...(state.videos[action.payload.videoId]?.annotations || []),
              { ...action.payload.annotation, id: (state.videos[action.payload.videoId]?.annotations || []).length },
            ],
          },
        },
      };
    case EDIT_ANNOTATION:
      return {
        ...state,
        videos: {
          ...state.videos,
          [action.payload.videoId]: {
            ...state.videos[action.payload.videoId],
            annotations: state.videos[action.payload.videoId]?.annotations.map(annotation =>
              annotation.id === action.payload.id
                ? { ...annotation, note: action.payload.note }
                : annotation
            ),
          },
        },
      };
    case DELETE_ANNOTATION:
      return {
        ...state,
        videos: {
          ...state.videos,
          [action.payload.videoId]: {
            ...state.videos[action.payload.videoId],
            annotations: state.videos[action.payload.videoId]?.annotations.filter(annotation => annotation.id !== action.payload.id),
          },
        },
      };
    case SET_VIDEO_ID:
      return {
        ...state,
        videoId: action.payload,
        videos: {
          ...state.videos,
          [action.payload]: state.videos[action.payload] || { annotations: [] },
        },
      };
    case SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: {
          ...state.currentTime,
          [action.payload.videoId]: action.payload.time,
        },
      };
    default:
      return state;
  }
};

export default reducer;
