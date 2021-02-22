import { createSlice } from '@reduxjs/toolkit';

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    isNavigationOpened: false,
  },
  reducers: {
    setNavigationOpenState: (state, action) => {
      state.isNavigationOpened = Boolean(action.payload);
    },
  },
});

export const { setNavigationOpenState } = navigationSlice.actions;

export default navigationSlice.reducer;
