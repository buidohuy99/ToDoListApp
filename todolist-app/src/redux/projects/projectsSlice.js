import { createSlice } from '@reduxjs/toolkit';

export const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    allProjects: null,
    currentViewingProject: null,
  },
  reducers: {
    setProjects: (state, action) => {
        state.allProjects = action.payload ? action.payload : null;
    },
    setCurrentViewingProject: (state, action) => {
        state.currentViewingProject = action.payload ? action.payload : null;
    },
  },
});

export const { setProjects, setCurrentViewingProject } = projectsSlice.actions;

export default projectsSlice.reducer;
