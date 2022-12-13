import { createSlice } from '@reduxjs/toolkit';
import { initStateGetAdminArticles, reducerGetAdminArticles } from '../actions/knowledgeBase/getAdminArticles.action';


export const initialState = {
    ...initStateGetAdminArticles,

  };
  
export const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {
    //   resetGetAdminTestingSingle(state) {
    //     state.getAdminTestingSingle = initStateGetAdminTestingSingle.getAdminTestingSingle;
    //   },
      resetGetAdminArticles(state) {
        state.getAdminArticles = initStateGetAdminArticles.getAdminArticles;
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
  export const articleReducer = articleSlice.reducer;