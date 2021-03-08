import { createSlice } from '@reduxjs/toolkit';

export const projectDetailSlice = createSlice({
  name: 'projectDetail',
  initialState: {
    currentViewingProject: null,
  },
  reducers: {
    setCurrentViewingProject: (state, action) => {
      state.currentViewingProject = action.payload ? action.payload : null;
    },
  },
});

export const { setCurrentViewingProject } = projectDetailSlice.actions;

export default projectDetailSlice.reducer;
