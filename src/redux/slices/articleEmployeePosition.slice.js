import { createSlice } from '@reduxjs/toolkit';
import { initStateGetArticlePostByArticle, reducerGetArticlePostByArticle } from '../actions/knowledgeBase/getArticlePostByArticle.action';
import { initStateCreateArticlePost, reducerCreateArticlePost } from '../actions/knowledgeBase/createArticlePost.action';


export const initialState = {
    ...initStateGetArticlePostByArticle,
    ...initStateCreateArticlePost,
  };
  
export const articlePostSlice = createSlice({
    name: 'articlePost',
    initialState,
    reducers: {
      resetGetArticlePostByArticle(state) {
        state.getArticles = initStateGetArticlePostByArticle.getArticlePostByArticle;
      },
      resetCreateArticlePost(state) {
        state.createArticlePostByArticle = initStateCreateArticlePost.createArticlePost;
      }
    },
    extraReducers: {
      ...reducerGetArticlePostByArticle,
      ...reducerCreateArticlePost,
    },
  });
  export const { resetGetArticlePostByArticle, resetGetArticles } = articlePostSlice.actions;
  export const articlePostReducer = articlePostSlice.reducer;