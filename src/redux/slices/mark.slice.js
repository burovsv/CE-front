import { createSlice } from '@reduxjs/toolkit';
import { initStateGetMarks, reducerGetMarks } from '../actions/knowledgeBase/getMarks.action';


export const initialState = {
    ...initStateGetMarks,

  };
  
export const markSlice = createSlice({
    name: 'mark',
    initialState,
    reducers: {
      resetGetMarks(state) {
        state.getMarks = initStateGetMarks.getMarks;
      },
      resetCreateMark(state) {
        state.createMark = initStateCreateMark.createMark;
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
  export const markReducer = markSlice.reducer;