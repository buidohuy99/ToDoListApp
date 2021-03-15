import { configureStore } from '@reduxjs/toolkit';
import reduxThunk from 'redux-thunk';

import navigationReducer from './navigation/navigationSlice';
import loadingReducer from './loading/loadingSlice';
import dialogReducer from './dialogs/dialogSlice';

import projectsReducer from './projects/projectsSlice';
import projectDetailReducer from './projectDetail/projectDetailSlice';

export default configureStore({
  reducer: {
    navigation: navigationReducer,
    loading: loadingReducer,
    projects: projectsReducer,
    projectDetail: projectDetailReducer,
    dialog: dialogReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(reduxThunk)
});
