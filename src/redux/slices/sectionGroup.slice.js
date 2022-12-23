import { createSlice } from '@reduxjs/toolkit';
import { initStateGetSectionGroups, reducerGetSectionGroups } from '../actions/knowledgeBase/getSectionGroups.action';


export const initialState = {
    ...initStateGetSectionGroups,

  };
  
export const sectionGroupSlice = createSlice({
    name: 'sectionGroup',
    initialState,
    reducers: {
    //   resetGetAdminTestingSingle(state) {
    //     state.getAdminTestingSingle = initStateGetAdminTestingSingle.getAdminTestingSingle;
    //   },
      resetGetSectionGroups(state) {
        state.getSectionGroups = initStateGetSectionGroups.getSectionGroups;
      },
    //   resetCreateTesting(state) {
    //     state.createTesting = initStateCreateTesting.createTesting;
    //   },
    //   resetUpdateTesting(state) {
    //     state.updateTesting = initStateUpdateTesting.updateTesting;
    //   },
    //   resetGetUserTesting(state) {
    //     state.getUserTesting = initStateGetUserTesting.getUserTesting;
    //   },
    },
    // extraReducers: {
    // ...reducerGetAdminArticles,
    //   ...reducerCreateTesting,
    //   ...reducerGetUserTesting,
    //   ...reducerUpdateTesting,
    //   ...reducerGetAdminTestingSingle,
    //   ...reducerGetUserTestingSingle,
    //   ...reducerDeleteTesting,
    // },
  });
//   export const { resetGetAdminTesting, resetGetAdminTestingSingle, resetCreateTesting, resetGetUserTesting, resetUpdateTesting } = testingSlice.actions;
  export const sectionGroupReducer = sectionGroupSlice.reducer;