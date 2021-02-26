import { configureStore } from '@reduxjs/toolkit';

import navigationReducer from './navigation/navigationSlice';
import loadingReducer from './loading/loadingSlice';
import projectsReducer from './projects/projectsSlice';

export default configureStore({
  reducer: {
    navigation: navigationReducer,
    loading: loadingReducer,
    projects: projectsReducer
  },
});
