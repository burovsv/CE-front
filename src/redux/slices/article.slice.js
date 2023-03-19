import { createSlice } from '@reduxjs/toolkit';
import { initStateGetArticles, reducerGetArticles } from '../actions/knowledgeBase/getArticles.action';
import { initStateGetArticlesUser, reducerGetArticlesUser } from '../actions/knowledgeBase/getArticlesUser.action';
import { initStateCreateArticle, reducerCreateArticle } from '../actions/knowledgeBase/createArticle.action';


export const initialState = {
    ...initStateGetArticles,
    ...initStateGetArticlesUser,
    ...initStateCreateArticle
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
      resetCreateArticle(state) {
        state.createArticle = initStateCreateArticle.createArticle;
      }
    },
    extraReducers: {
      ...reducerGetArticles,
      ...reducerGetArticlesUser,
      ...reducerCreateArticle,
    },
  });
  export const { resetCreateArticle, resetGetArticles, resetGetArticlesUser } = articleSlice.actions;
  export const articleReducer = articleSlice.reducer;