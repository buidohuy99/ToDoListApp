import { createSlice } from '@reduxjs/toolkit';

export const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    searchString: null,
    currentProjects: [],
  },
  reducers: {
    setCurrentProjects: (state, action) => {
      state.currentProjects = action.payload ? Array.isArray(action.payload) ? action.payload : [] : []; 
    },
    setSearchString: (state, action) => {
      state.searchString = action.payload ? action.payload : null;
    },
  },
});

export const { setSearchString, setCurrentProjects } = projectsSlice.actions;

export default projectsSlice.reducer;
