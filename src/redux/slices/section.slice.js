import { createSlice } from '@reduxjs/toolkit';
import { initStateGetSections, reducerGetSections } from '../actions/knowledgeBase/getSections.action';


export const initialState = {
    ...initStateGetSections,

  };
  
export const sectionSlice = createSlice({
    name: 'section',
    initialState,
    reducers: {
    //   resetGetAdminTestingSingle(state) {
    //     state.getAdminTestingSingle = initStateGetAdminTestingSingle.getAdminTestingSingle;
    //   },
      resetGetSections(state) {
        state.getSections = initStateGetSections.getSections;
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
  export const sectionReducer = sectionSlice.reducer;