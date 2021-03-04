import { createSlice } from '@reduxjs/toolkit';

export const projectDetailSlice = createSlice({
  name: 'projectDetail',
  initialState: {
    currentProject_ChildTasks: null,
    currentProject_ChildProjects: null,

    currentViewingProject: null,
  },
  reducers: {
    setCurrentViewingProject: (state, action) => {
      state.currentViewingProject = action.payload ? action.payload : null;
    },

    setCurrentProjectChildTasks: (state, action) => {
      state.currentProject_ChildTasks = action.payload ? action.payload : null;
    },
    setCurrentProjectChildProjects: (state, action) => {
      state.currentProject_ChildProjects = action.payload ? action.payload : null;
    },
  },
});

export const { setCurrentProjectChildProjects, setCurrentProjectChildTasks, setCurrentModifyingTask, setOpenAddModifyTaskDialog, setOpenCreateModifyProjectDialog, setCurrentViewingProject } = projectDetailSlice.actions;

export default projectDetailSlice.reducer;
