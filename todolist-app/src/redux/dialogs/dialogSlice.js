import { createSlice } from '@reduxjs/toolkit';

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState: {
    openCreateModifyProjectDialog: false,
    currentModifyingProject: null,
    
    currentModifyingTask: null,
    openAddModifyTaskDialog: false,

    openAssignUsersDialog: false,
    usersListOfAssignDialog: null,
    participantsOfAssignDialog: null,
    isDialogInSearchMode: false,
    isLoadingUsersList: false,

    parentProject: null,
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

    setOpenAssignUsersDialog: (state, action) => {
      state.openAssignUsersDialog = Boolean(action.payload);
    },
    setIsDialogInSearchMode: (state, action) => {
      state.isDialogInSearchMode = Boolean(action.payload);
    },
    setUserListsForAssignDialog: (state, action) => {
      state.usersListOfAssignDialog = action.payload ? action.payload : null;
    },
    setParticipantsOfAssignDialog: (state, action) => {
      state.participantsOfAssignDialog = action.payload ? action.payload : null;
    },
    setIsLoadingUsersList: (state, action) => {
      state.isLoadingUsersList = Boolean(action.payload);
    }
  },
});

export const { setCurrentModifyingProject, setOpenCreateModifyProjectDialog, setParentProject, 
  setCurrentModifyingTask, setOpenAddModifyTaskDialog, setOpenAssignUsersDialog, setIsDialogInSearchMode, 
  setUserListsForAssignDialog, setParticipantsOfAssignDialog, setIsLoadingUsersList } = dialogSlice.actions;

export default dialogSlice.reducer;
