import { createSlice } from '@reduxjs/toolkit';
import { initStateGetArticleMarkByArticle, reducerGetArticleMarkByArticle } from '../actions/knowledgeBase/getArticleMarkByArticle.action';
import { initStateCreateArticleMark, reducerCreateArticleMark } from '../actions/knowledgeBase/createArticleMark.action';


export const initialState = {
    ...initStateGetArticleMarkByArticle,
    ...initStateCreateArticleMark,
  };
  
export const articleMarkSlice = createSlice({
    name: 'articleMark',
    initialState,
    reducers: {
      resetGetArticleMarkByArticle(state) {
        state.getArticles = initStateGetArticleMarkByArticle.getArticleMarkByArticle;
      },
      resetCreateArticleMark(state) {
        state.createArticleMark = initStateCreateArticleMark.createArticleMark;
      }
    },
    extraReducers: {
      ...reducerGetArticleMarkByArticle,
      ...reducerCreateArticleMark,
    },
  });
  export const { resetGetArticleMarkByArticle, resetCreateArticleMark } = articleMarkSlice.actions;
  export const articleMarkReducer = articleMarkSlice.reducer;