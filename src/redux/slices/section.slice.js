import { createSlice } from '@reduxjs/toolkit';
import { initStateGetSections, reducerGetSections } from '../actions/knowledgeBase/getSections.action';
import { initStateGetSectionsByGroup, reducerGetSectionsByGroup } from '../actions/knowledgeBase/getSectionsByGroup.action';
import { initStateCreateSection, reducerCreateSection } from '../actions/knowledgeBase/createSection.action';


export const initialState = {
    ...initStateGetSections,
    ...initStateGetSectionsByGroup,
    ...initStateCreateSection,
  };
  
export const sectionSlice = createSlice({
    name: 'section',
    initialState,
    reducers: {

      resetGetSections(state) {
        state.getSections = initStateGetSections.getSections;
      },
      resetGetSectionsByGroup(state) {
        state.getSectionsByGroup = initStateGetSectionsByGroup.getSectionsByGroup;
      },
      resetCreateSection(state) {
        state.createSection = initStateCreateSection.createSection;
      },
    },
    extraReducers: {
      ...reducerCreateSection,
      ...reducerGetSections,
      ...reducerGetSectionsByGroup,
    }

  });
  export const { resetGetSections, resetGetSectionsByGroup, resetCreateSection, } = sectionSlice.actions;
  export const sectionReducer = sectionSlice.reducer;