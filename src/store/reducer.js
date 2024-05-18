import { ADD_ANNOTATION, EDIT_ANNOTATION, DELETE_ANNOTATION, SET_VIDEO_ID, SET_CURRENT_TIME } from './actions';

const initialState = {
  currentTime: {},
  videos: {},
  videoId: '',
};

// Load state from local storage if available
const savedState = localStorage.getItem('reduxState');
const persistedState = savedState ? JSON.parse(savedState) : initialState;

const reducer = (state = persistedState, action) => {
  let nextState;

  switch (action.type) {
    case ADD_ANNOTATION:
      nextState = {
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
      break;

    case EDIT_ANNOTATION:
      nextState = {
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
      break;

    case DELETE_ANNOTATION:
      nextState = {
        ...state,
        videos: {
          ...state.videos,
          [action.payload.videoId]: {
            ...state.videos[action.payload.videoId],
            annotations: state.videos[action.payload.videoId]?.annotations.filter(annotation => annotation.id !== action.payload.id),
          },
        },
      };
      break;

    case SET_VIDEO_ID:
      nextState = {
        ...state,
        videoId: action.payload,
        videos: {
          ...state.videos,
          [action.payload]: state.videos[action.payload] || { annotations: [] },
        },
      };
      break;

    case SET_CURRENT_TIME:
      nextState = {
        ...state,
        currentTime: {
          ...state.currentTime,
          [action.payload.videoId]: action.payload.time,
        },
      };
      break;

    default:
      nextState = state;
  }

  // Save state to local storage after each action
  localStorage.setItem('reduxState', JSON.stringify(nextState));

  return nextState;
};

export default reducer;
