import { createSlice } from '@reduxjs/toolkit';
import { initStateGetArticles, reducerGetArticles } from '../actions/knowledgeBase/getArticles.action';
import { initStateCreateArticle, reducerCreateArticle } from '../actions/knowledgeBase/createArticle.action';


export const initialState = {
    ...initStateGetArticles,
    ...initStateCreateArticle
  };
  
export const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {
      resetGetArticles(state) {
        state.getArticles = initStateGetArticles.getArticles;
      },
      resetCreateArticle(state) {
        state.creareArticle = initStateCreateArticle.creareArticle;
      }
    },
    extraReducers: {
      ...reducerGetArticles,
      ...reducerCreateArticle,
    },
  });
  export const { resetCreateArticle, resetGetArticles } = articleSlice.actions;
  export const articleReducer = articleSlice.reducer;