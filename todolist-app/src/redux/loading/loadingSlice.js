import { createSlice } from '@reduxjs/toolkit';

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    loadingPrompt: "Page is initializing, please wait...",
    isConnecting : true,
    globalError: null,
  },
  reducers: {
    setLoadingPrompt: (state, action) => {
      state.loadingPrompt = action.payload ? String(action.payload) : null;
    },
    setGlobalError: (state, action) => {
      state.globalError = action.payload ? String(action.payload) : null;
    },
    setIsConnecting: (state, action) => {
      state.isConnecting = Boolean(action.payload);
    }
  },
});

export const { setLoadingPrompt, setIsConnecting, setGlobalError } = loadingSlice.actions;

export default loadingSlice.reducer;
