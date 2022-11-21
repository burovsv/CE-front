import { configureStore } from '@reduxjs/toolkit';
import { appReducer } from './slices/app.slice';
import { categoryReducer } from './slices/category.slice';
import { employeeReducer } from './slices/employee.slice';
import { newsReducer } from './slices/news.slice';
import { newsFilterReducer } from './slices/newsFilter.slice';
import { newsTypeReducer } from './slices/newsType.slice';
import { postReducer } from './slices/post.slice';
import { searchReducer } from './slices/search.slice';
import { subdivisionReducer } from './slices/subdivision.slice';
import { testingReducer } from './slices/testing.slice';
import { testingFilterReducer } from './slices/testingFilter.slice';

export const store = configureStore({
  reducer: {
    employee: employeeReducer,
    app: appReducer,
    news: newsReducer,
    newsType: newsTypeReducer,
    newsFilter: newsFilterReducer,
    post: postReducer,
    testing: testingReducer,
    subdivision: subdivisionReducer,
    category: categoryReducer,
    search: searchReducer,
    testingFilter: testingFilterReducer,
  },
});
