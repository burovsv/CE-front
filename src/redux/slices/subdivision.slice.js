import { createSlice } from '@reduxjs/toolkit';
import { initStateGetSubdivisions, reducerGetSubdivisions } from '../actions/subdivision/getSubdivisions.action';
import { initStateGetSubdivisionsByPosts, reducerGetSubdivisionsByPosts } from '../actions/subdivision/getSubdivisionsByPosts.action';
import { initStateGetSubdivisionsWithPosts, reducerGetSubdivisionsWithPosts } from '../actions/subdivision/getSubdivisionWithPosts.action';
import { initStateGetSubdivisionWorkTimeTemplates, reducerGetSubdivisionWorkTimeTemplates } from '../actions/subdivision/getSubdivisionWorkTimeTemplates.action';

export const initialState = {
  ...initStateGetSubdivisions,
  ...initStateGetSubdivisionsByPosts,
  ...initStateGetSubdivisionsWithPosts,
  ...initStateGetSubdivisionWorkTimeTemplates,
  workTimeTemplate: {
    workTimeEnd1: '23:00',
    workTimeEnd2: '23:00',
    workTimeEnd3: '23:00',
    workTimeEnd4: '23:00',
    workTimeStart1: '08:00',
    workTimeStart2: '08:00',
    workTimeStart3: '08:00',
    workTimeStart4: '08:00',
  },
};

export const subdivisionSlice = createSlice({
  name: 'subdivision',
  initialState,
  reducers: {
    setWorkTimeTemplate(state, action) {
      state.workTimeTemplate = action.payload;
    },
    resetGetSubdivisionsWithPosts(state) {
      state.getSubdivisionsWithPosts = initStateGetSubdivisionsWithPosts.getSubdivisionsWithPosts;
    },
    resetGetSubdivisions(state) {
      state.getSubdivisions = initStateGetSubdivisions.getSubdivisions;
    },
    resetGetSubdivisionsByPosts(state) {
      state.getSubdivisionsByPosts = initStateGetSubdivisionsByPosts.getSubdivisionsByPosts;
    },
    resetGetSubdivisionWorkTimeTemplates(state) {
      state.getSubdivisionWorkTimeTemplates = initStateGetSubdivisionWorkTimeTemplates.getSubdivisionWorkTimeTemplates;
    },
  },
  extraReducers: {
    ...reducerGetSubdivisions,
    ...reducerGetSubdivisionsByPosts,
    ...reducerGetSubdivisionsWithPosts,
    ...reducerGetSubdivisionWorkTimeTemplates,
  },
});
export const { resetGetSubdivisionsWithPosts, resetGetSubdivisions, resetGetSubdivisionsByPosts, resetGetSubdivisionWorkTimeTemplates, setWorkTimeTemplate } = subdivisionSlice.actions;
export const subdivisionReducer = subdivisionSlice.reducer;
