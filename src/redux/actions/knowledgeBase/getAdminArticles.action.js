import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetAdminArticles = {
    getAdminArticles: { data: [
      {
        'date': '12.12.2022',
        'name': 'Сверхзвуковые волны',
        'section': 'Физ',
        'sectionGroup': 'Физ2.0'
      },
      {
        'date': '12.12.2022',
        'name': 'Как качаться на волнах',
        'section': 'пл',
        'sectionGroup': 'пл2.0'
      },
    ], loading: false, error: null },
  };

  export const getAdminArticles = () => {
    console.log(initStateGetAdminArticles.getAdminArticles);
    return initStateGetAdminArticles.getAdminArticles

  }
  // export const getAdminArticles = () => {
  //   getAdminArticles: { 
  //     data: [ {
  //     date: '12.12.2022',
  //     name: 'Сверхзвуковые волны',
  //     section: 'Физ',
  //     sectionGroup: 'Физ2.0'
  //     }], 
  //     loading: false, 
  //     error: null },
    
  // };

  export const reducerGetAdminArticles = {
    [getAdminArticles.pending]: (state) => {
      state.getAdminArticles.loading = true;
    },
    [getAdminArticles.fulfilled]: (state, action) => {
      state.getAdminArticles.loading = false;
      state.getAdminArticles.data = action.payload.list;
      state.getAdminArticles.count = action.payload.count;
  
      state.getAdminArticles.error = null;
    },
    [getAdminArticles.rejected]: (state, action) => {
      state.getAdminArticles.loading = false;
      state.getAdminArticles.error = action.payload;
    },
  };