import { createSlice } from '@reduxjs/toolkit';

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState: {
    //Create modify project dialog
    openCreateModifyProjectDialog: false,
    currentModifyingProject: null,
    
    //add Modify task dialog
    currentModifyingTask: null,
    openAddModifyTaskDialog: false,

    //Assign user dialog
    openAssignUsersDialog: false,
    usersListOfAssignDialog: null,
    participantsOfAssignDialog: null,
    isDialogInSearchMode: false,
    isLoadingUsersList: false,
    canUserDoAssignment: false,

    //Edit user roles dialog
    openUserRolesEditDialog: false,
    userForUserRolesEditDialog: null,

    //parent project for dialogs to use when calling API
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
    },
    setCanUserDoAssignment: (state, action) => {
      state.canUserDoAssignment = Boolean(action.payload);
    },

    setOpenUserRolesEditDialog: (state, action) => {
      state.openUserRolesEditDialog = Boolean(action.payload);
    },
    setUserForUserRolesEditDialog: (state, action) => {
      state.userForUserRolesEditDialog = action.payload ? action.payload : null;
    }
  },
});

export const { setCurrentModifyingProject, setOpenCreateModifyProjectDialog, setParentProject, 
  
  setCurrentModifyingTask, setOpenAddModifyTaskDialog, 
  
  setOpenAssignUsersDialog, setIsDialogInSearchMode, 
  setUserListsForAssignDialog, setParticipantsOfAssignDialog, setIsLoadingUsersList,
  setCanUserDoAssignment,

  setOpenUserRolesEditDialog, setUserForUserRolesEditDialog } = dialogSlice.actions;

export default dialogSlice.reducer;
