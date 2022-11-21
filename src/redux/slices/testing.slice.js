import { createSlice } from '@reduxjs/toolkit';
import { reducerGetAdminNewsSingle } from '../actions/news/getAdminNewsSingle.action';
import { initStateGetUserNewsSingle } from '../actions/news/getUserNewsSingle.action';
import { initStateCreateTesting, reducerCreateTesting } from '../actions/testing/createTesting.action';
import { initStateDeleteTesting, reducerDeleteTesting } from '../actions/testing/deleteTesting.action';
import { initStateGetAdminTesting, reducerGetAdminTesting } from '../actions/testing/getAdminTesting.action';
import { initStateGetAdminTestingSingle, reducerGetAdminTestingSingle } from '../actions/testing/getAdminTestingSingle.action';
import { initStateGetUserTesting, reducerGetUserTesting } from '../actions/testing/getUserTesting.action';
import { reducerGetUserTestingSingle } from '../actions/testing/getUserTestingSingle.action';
import { initStateUpdateTesting, reducerUpdateTesting } from '../actions/testing/updateTesting.action';

export const initialState = {
  ...initStateGetAdminTesting,
  ...initStateCreateTesting,
  ...initStateGetUserTesting,
  ...initStateUpdateTesting,
  ...initStateGetAdminTestingSingle,
  ...initStateGetUserNewsSingle,
  ...initStateDeleteTesting,
};

export const testingSlice = createSlice({
  name: 'testing',
  initialState,
  reducers: {
    resetGetAdminTestingSingle(state) {
      state.getAdminTestingSingle = initStateGetAdminTestingSingle.getAdminTestingSingle;
    },
    resetGetAdminTesting(state) {
      state.getAdminTesting = initStateGetAdminTesting.getAdminTesting;
    },
    resetCreateTesting(state) {
      state.createTesting = initStateCreateTesting.createTesting;
    },
    resetUpdateTesting(state) {
      state.updateTesting = initStateUpdateTesting.updateTesting;
    },
    resetGetUserTesting(state) {
      state.getUserTesting = initStateGetUserTesting.getUserTesting;
    },
  },
  extraReducers: {
    ...reducerGetAdminTesting,
    ...reducerCreateTesting,
    ...reducerGetUserTesting,
    ...reducerUpdateTesting,
    ...reducerGetAdminTestingSingle,
    ...reducerGetUserTestingSingle,
    ...reducerDeleteTesting,
  },
});
export const { resetGetAdminTesting, resetGetAdminTestingSingle, resetCreateTesting, resetGetUserTesting, resetUpdateTesting } = testingSlice.actions;
export const testingReducer = testingSlice.reducer;
