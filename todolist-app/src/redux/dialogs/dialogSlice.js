import { createSlice } from '@reduxjs/toolkit';

import { APIWorker } from '../../services/axios';

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState: {
    //Create modify project dialog
    openCreateModifyProjectDialog: false,
    currentModifyingProject: null,
    
    //add Modify task dialog
    openAddModifyTaskDialog: false,

    //Assign user dialog
    openAssignUsersDialog: false,
    usersListOfAssignDialog: null,
    isDialogInSearchMode: false,
    isLoadingUsersList: false,

    //Assign to task dialog
    openAssignToTaskDialog: false,
    currentModifyingTask: null,

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
    setIsLoadingUsersList: (state, action) => {
      state.isLoadingUsersList = Boolean(action.payload);
    },

    setOpenAssignToTaskDialog: (state, action) => {
      state.openAssignToTaskDialog = Boolean(action.payload);
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
  setUserListsForAssignDialog, setIsLoadingUsersList,

  setOpenAssignToTaskDialog,

  setOpenUserRolesEditDialog, setUserForUserRolesEditDialog } = dialogSlice.actions;

// Roles Edit dialog async actions
export function addNewRole(payload, onSuccess, onFailed) {
  return async (dispatch, getState) => {
    try{
      const result = await APIWorker.postAPI('/main-business/v1/participation-management/participation', {
          projectId: payload.projectId,
          userId: payload.userId,
          roleId: payload.roleId,
      });
      const {data} = result.data;
      if(onSuccess) {
        onSuccess(data);
      }
    } catch (e) {
      console.log(e);
      if(onFailed){
        onFailed(e);
      }
    }
  }
}

export function removeRole(payload, onSuccess, onFailed) {
  return async (dispatch, getState) => {
    try{
      const query = `RemoveFromProjectId=${payload.projectId}&RemoveUserId=${payload.userId}&RemoveProjectRoleId=${payload.roleId}`
      const result = await APIWorker.callAPI('delete', '/main-business/v1/participation-management/participation?' + query);
            
      const {data} = result.data;
      if(onSuccess) {
        onSuccess(data);
      }
    } catch (e) {
      console.log(e);
      if(onFailed){
        onFailed(e);
      }
    }
  }
}

export default dialogSlice.reducer;
