import { createSlice } from '@reduxjs/toolkit';
import { initStateGetSectionGroups, reducerGetSectionGroups } from '../actions/knowledgeBase/getSectionGroups.action';
import { initStateCreateSectionGroup, reducerCreateSectionGroup } from '../actions/knowledgeBase/createSectionGroup.action';


export const initialState = {
    ...initStateGetSectionGroups,
    ...initStateCreateSectionGroup,
  };
  
export const sectionGroupSlice = createSlice({
    name: 'sectionGroup',
    initialState,
    reducers: {

      resetGetSectionGroups(state) {
        state.getSectionGroups = initStateGetSectionGroups.getSectionGroups;
      },
      resetCreateSectionGroup(state) {
        state.createSectionGroup = initStateCreateSectionGroup.createSectionGroup;
      },
    },
    extraReducers: {
      ...reducerCreateSectionGroup,
      ...reducerGetSectionGroups,
    }
  });
  export const { resetGetSectionGroups, resetCreateSectionGroup } = sectionGroupSlice.actions;
  export const sectionGroupReducer = sectionGroupSlice.reducer;