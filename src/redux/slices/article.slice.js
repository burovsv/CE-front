import { createSlice } from '@reduxjs/toolkit';
import { initStateGetArticles, reducerGetArticles } from '../actions/knowledgeBase/getArticles.action';
import { initStateGetArticlesUser, reducerGetArticlesUser } from '../actions/knowledgeBase/getArticlesUser.action';
import { initStateGetOneArticle, reducerGetOneArticle } from '../actions/knowledgeBase/getOneArticle.action';
import { initStateCreateArticle, reducerCreateArticle } from '../actions/knowledgeBase/createArticle.action';
import { initStateUpdateArticle, reducerUpdateArticle } from '../actions/knowledgeBase/updateArticle.action';


export const initialState = {
    ...initStateGetArticles,
    ...initStateGetArticlesUser,
    ...initStateGetOneArticle,
    ...initStateCreateArticle,
    ...initStateUpdateArticle,
  };
  
export const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {
      resetGetArticles(state) {
        state.getArticles = initStateGetArticles.getArticles;
      },
      resetGetArticlesUser(state) {
        state.getArticlesUser = initStateGetArticlesUser.getArticlesUser;
      },
      resetGetOneArticle(state) {
        state.getOneArticle = initStateGetOneArticle.getOneArticle;
      },
      resetCreateArticle(state) {
        state.createArticle = initStateCreateArticle.createArticle;
      },
      resetUpdateArticle(state) {
        state.updateArticle = initStateUpdateArticle.updateArticle;
      }
    },
    extraReducers: {
      ...reducerGetArticles,
      ...reducerGetArticlesUser,
      ...reducerGetOneArticle,
      ...reducerCreateArticle,
      ...reducerUpdateArticle,
    },
  });
  export const { resetCreateArticle, resetGetArticles, resetGetOneArticle, resetGetArticlesUser, resetUpdateArticle } = articleSlice.actions;
  export const articleReducer = articleSlice.reducer;