import { createSlice } from '@reduxjs/toolkit';

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    loadingPrompt: null,
  },
  reducers: {
    setLoadingPrompt: (state, action) => {
      state.loadingPrompt = action.payload ? String(action.payload) : null;
    },
  },
});

export const { setLoadingPrompt } = loadingSlice.actions;

export default loadingSlice.reducer;
