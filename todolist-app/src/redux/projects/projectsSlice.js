import { createSlice } from '@reduxjs/toolkit';

export const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    openCreateModifyProjectDialog: false,
    searchString: null,
    currentModifyingProject: null,

    currentProjects: [],

    currentViewingProject: null,
  },
  reducers: {
    setCurrentViewingProject: (state, action) => {
      state.currentViewingProject = action.payload ? action.payload : null;
    },

    setCurrentProjects: (state, action) => {
      state.currentProjects = action.payload ? Array.isArray(action.payload) ? action.payload : [] : []; 
    },

    setSearchString: (state, action) => {
      state.searchString = action.payload ? action.payload : null;
    },
    setCurrentModifyingProject: (state, action) => {
      state.currentModifyingProject = action.payload ? action.payload : null;
    },
    setOpenState_CreateModifyProjectDialog: (state, action) => {
      state.openCreateModifyProjectDialog = Boolean(action.payload);
    }
  },
});

export const { setCurrentViewingProject, setSearchString, setCurrentModifyingProject, setOpenState_CreateModifyProjectDialog, setCurrentProjects } = projectsSlice.actions;

export default projectsSlice.reducer;
