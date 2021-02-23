import { createSlice } from '@reduxjs/toolkit';

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    isNavigationOpened: false,
    currentPage: null,
  },
  reducers: {
    setNavigationOpenState: (state, action) => {
      state.isNavigationOpened = Boolean(action.payload);
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload ? String(action.payload) : null;
    }
  },
});

export const { setNavigationOpenState, setCurrentPage } = navigationSlice.actions;

export default navigationSlice.reducer;
