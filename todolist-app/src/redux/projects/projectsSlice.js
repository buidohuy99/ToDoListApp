import { createSlice } from '@reduxjs/toolkit';

export const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    currentViewingProject: null,
    searchString: null,
  },
  reducers: {
    setCurrentViewingProject: (state, action) => {
      state.currentViewingProject = action.payload ? action.payload : null;
    },
    setSearchString: (state, action) => {
      state.searchString = action.payload ? action.payload : null;
    }
  },
});

export const { setCurrentViewingProject, setSearchString } = projectsSlice.actions;

export default projectsSlice.reducer;
