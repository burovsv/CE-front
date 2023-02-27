import { createSlice } from '@reduxjs/toolkit';
import { initStateGetArticleEmployeePositionByArticle, reducerGetArticleEmployeePositionByArticle } from '../actions/knowledgeBase/getArticleEmployeePositionByArticle.action';
import { initStateCreateArticleEmployeePosition, reducerCreateArticleEmployeePosition } from '../actions/knowledgeBase/createArticleEmployeePosition.action';


export const initialState = {
    ...initStateGetArticleEmployeePositionByArticle,
    ...initStateCreateArticleEmployeePosition,
  };
  
export const articleEmployeePositionSlice = createSlice({
    name: 'articleEmployeePosition',
    initialState,
    reducers: {
      resetGetArticleEmployeePositionByArticle(state) {
        state.getArticles = initStateGetArticleEmployeePositionByArticle.getArticleEmployeePositionByArticle;
      },
      resetCreateArticleEmployeePosition(state) {
        state.createArticleEmployeePositionByArticle = initStateCreateArticleEmployeePosition.createArticleEmployeePosition;
      }
    },
    extraReducers: {
      ...reducerGetArticleEmployeePositionByArticle,
      ...reducerCreateArticleEmployeePosition,
    },
  });
  export const { resetGetArticleEmployeePositionByArticle, resetGetArticles } = articleEmployeePositionSlice.actions;
  export const articleEmployeePositionReducer = articleEmployeePositionSlice.reducer;