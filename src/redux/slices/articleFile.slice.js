import { createSlice } from '@reduxjs/toolkit';
import { initStateCreateArticleFile, reducerCreateArticleFile } from '../actions/knowledgeBase/createArticleFile.action';
import { initStateDeleteArticleFile, reducerDeleteArticleFile } from '../actions/knowledgeBase/deleteArticleFile.action';


export const initialState = {
    ...initStateCreateArticleFile,
    ...initStateDeleteArticleFile,
  };
  
export const articleFileSlice = createSlice({
    name: 'articleFile',
    initialState,
    reducers: {
      resetCreateArticleFile(state) {
        state.createArticleFile = initStateCreateArticleFile.createArticleFile;
      },
      resetDeleteArticleFile(state) {
        state.deleteArticleFile = initStateDeleteArticleFile.deleteArticleFile;
      }
    },
    extraReducers: {
      ...reducerCreateArticleFile,
      ...reducerDeleteArticleFile,
    },
  });
  export const { resetCreateArticleFile, resetDeleteArticleFile } = articleFileSlice.actions;
  export const articleFileReducer = articleFileSlice.reducer;