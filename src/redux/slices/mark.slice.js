import { createSlice } from '@reduxjs/toolkit';
import { initStateGetMarks, reducerGetMarks } from '../actions/knowledgeBase/getMarks.action';
import { initStateCreateMark, reducerCreateMark } from '../actions/knowledgeBase/createMark.action';


export const initialState = {
    ...initStateGetMarks,
    ...initStateCreateMark
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
    },
    extraReducers: {
      ...reducerGetMarks,
      ...reducerCreateMark,
    }
  });
  export const { resetGetMarks, resetCreateMark } = markSlice.actions;
  export const markReducer = markSlice.reducer;