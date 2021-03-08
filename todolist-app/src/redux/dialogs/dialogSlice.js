import { createSlice } from '@reduxjs/toolkit';

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState: {
    openCreateModifyProjectDialog: false,
    currentModifyingProject: null,
    
    parentProject: null,

    currentModifyingTask: null,
    openAddModifyTaskDialog: false,
  },
  reducers: {
    setCurrentModifyingProject: (state, action) => {
      state.currentModifyingProject = action.payload ? action.payload : null;
    },
    setOpenCreateModifyProjectDialog: (state, action) => {
      state.openCreateModifyProjectDialog = Boolean(action.payload);
    },

    setParentProject: (state, action) => {
      state.parentProject = action.payload ? action.payload : null;
    },

    setCurrentModifyingTask: (state, action) => {
        state.currentModifyingTask = action.payload ? action.payload : null;
    },
    setOpenAddModifyTaskDialog: (state, action) => {
        state.openAddModifyTaskDialog = Boolean(action.payload);
    },
  },
});

export const { setCurrentModifyingProject, setOpenCreateModifyProjectDialog, setParentProject, setCurrentModifyingTask, setOpenAddModifyTaskDialog } = dialogSlice.actions;

export default dialogSlice.reducer;
