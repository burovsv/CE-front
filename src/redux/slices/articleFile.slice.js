import { createSlice } from '@reduxjs/toolkit';
import { initStateCreateArticleFile, reducerCreateArticleFile } from '../actions/knowledgeBase/createArticleFile.action';


export const initialState = {
    ...initStateCreateArticleFile,
  };
  
export const articleFileSlice = createSlice({
    name: 'articleFile',
    initialState,
    reducers: {
      resetCreateArticleFile(state) {
        state.createArticleFile = initStateCreateArticleFile.createArticleFile;
      }
    },
    extraReducers: {
      ...reducerCreateArticleFile,
    },
  });
  export const { resetCreateArticleFile } = articleFileSlice.actions;
  export const articleFileReducer = articleFileSlice.reducer;