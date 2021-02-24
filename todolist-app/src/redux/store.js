import { configureStore } from '@reduxjs/toolkit';

import navigationReducer from './navigation/navigationSlice';
import loadingReducer from './loading/loadingSlice';

export default configureStore({
  reducer: {
    navigation: navigationReducer,
    loading: loadingReducer,
  },
});
