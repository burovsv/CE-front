import { createSlice } from '@reduxjs/toolkit';
import { initStateCreateNews, reducerCreateNews } from '../actions/news/createNews.action';
import { initStateDeleteNews, reducerDeleteNews } from '../actions/news/deleteNews.action';
import { initStateGetAdminNews, reducerGetAdminNews } from '../actions/news/getAdminNews.action';
import { initStateGetAdminNewsSingle, reducerGetAdminNewsSingle } from '../actions/news/getAdminNewsSingle.action';
import { initStateGetNewsCalendar, reducerGetNewsCalendar } from '../actions/news/getNewsCalendar.action';
import { initStateGetUserNews, reducerGetUserNews } from '../actions/news/getUserNews.action';
import { initStateGetUserNewsSingle, reducerGetUserNewsSingle } from '../actions/news/getUserNewsSingle.action';
import { initStateUpdateNews, reducerUpdateNews } from '../actions/news/updateNews.action';

export const initialState = {
  ...initStateGetAdminNews,
  ...initStateCreateNews,
  ...initStateGetUserNews,
  ...initStateGetUserNewsSingle,
  ...initStateGetAdminNewsSingle,
  ...initStateUpdateNews,
  ...initStateDeleteNews,
  ...initStateGetNewsCalendar,
  activeCalendarDates: null,
  nextEventCalendar: null,
};

export const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    resetGetAdminNews(state) {
      state.getAdminNews = initStateGetAdminNews.getAdminNews;
    },
    resetCreateNews(state) {
      state.createNews = initStateCreateNews.createNews;
    },
    resetUpdateNews(state) {
      state.updateNews = initStateUpdateNews.updateNews;
    },
    resetGetAdminNewsSingle(state) {
      state.getAdminNewsSingle = initStateGetAdminNewsSingle.getAdminNewsSingle;
    },
    resetGetUserNewsSingle(state) {
      state.getUserNewsSingle = initStateGetUserNewsSingle.getUserNewsSingle;
    },
    resetGetUserNews(state) {
      state.getUserNews = initStateGetUserNews.getUserNews;
    },
    resetGetNewsCalendar(state) {
      state.getNewsCalendar = initStateGetNewsCalendar.getNewsCalendar;
    },
    setActiveCalendarDates(state, data) {
      state.activeCalendarDates = data.payload;
    },
    setNextEventCalendar(state, data) {
      state.nextEventCalendar = data.payload;
    },
  },
  extraReducers: {
    ...reducerGetAdminNews,
    ...reducerCreateNews,
    ...reducerGetUserNews,
    ...reducerGetUserNewsSingle,
    ...reducerGetAdminNewsSingle,
    ...reducerUpdateNews,
    ...reducerDeleteNews,
    ...reducerGetNewsCalendar,
  },
});
export const { resetGetAdminNews, resetCreateNews, resetGetAdminNewsSingle, resetGetUserNews, resetUpdateNews, resetGetUserNewsSingle, setActiveCalendarDates, resetGetNewsCalendar, setNextEventCalendar } = newsSlice.actions;
export const newsReducer = newsSlice.reducer;
