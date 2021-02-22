import { configureStore } from '@reduxjs/toolkit';

import navigationReducer from './navigation/navigationSlice';

export default configureStore({
  reducer: {
    navigation: navigationReducer
  },
});
