import { createSlice } from '@reduxjs/toolkit';

export const projectDetailSlice = createSlice({
  name: 'projectDetail',
  initialState: {
    currentViewingProject: null,
    canUserDoAssignment: false,
    participantsOfViewingProject: null,
  },
  reducers: {
    setCurrentViewingProject: (state, action) => {
      state.currentViewingProject = action.payload ? action.payload : null;
    },
    setCanUserDoAssignment: (state, action) => {
      state.canUserDoAssignment = Boolean(action.payload);
    },
    setParticipantsOfViewingProject: (state, action) => {
      state.participantsOfViewingProject = action.payload ? action.payload : null;
    },
  },
});

export const { setCurrentViewingProject, setParticipantsOfViewingProject, setCanUserDoAssignment } = projectDetailSlice.actions;

export default projectDetailSlice.reducer;
