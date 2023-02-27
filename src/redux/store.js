import { configureStore } from '@reduxjs/toolkit';
import { appReducer } from './slices/app.slice';
import { categoryReducer } from './slices/category.slice';
import { employeeReducer } from './slices/employee.slice';
import { employeeHistoryReducer } from './slices/employeeHistory.slice';
import { newsReducer } from './slices/news.slice';
import { newsFilterReducer } from './slices/newsFilter.slice';
import { newsTypeReducer } from './slices/newsType.slice';
import { postReducer } from './slices/post.slice';
import { searchReducer } from './slices/search.slice';
import { subdivisionReducer } from './slices/subdivision.slice';
import { testingReducer } from './slices/testing.slice';
import { testingFilterReducer } from './slices/testingFilter.slice';
import { workCalendarReducer } from './slices/workCalendar.slice';

import { articleReducer } from './slices/article.slice';
import { markReducer } from './slices/mark.slice';
import { sectionReducer } from './slices/section.slice';
import { sectionGroupReducer } from './slices/sectionGroup.slice';
import { employeePositionReducer } from './slices/employeePosition.slice';
import { articleEmployeePositionReducer } from './slices/articleEmployeePosition.slice';
import { articleMarkReducer } from './slices/articleMark.slice';

export const store = configureStore({
  reducer: {
    employeeHistory: employeeHistoryReducer,
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
    workCalendar: workCalendarReducer,
    article: articleReducer,
    mark: markReducer,
    section: sectionReducer,
    sectionGroup: sectionGroupReducer,
    employeePosition: employeePositionReducer,
    articleMark: articleMarkReducer,
    articleEmployeePosition: articleEmployeePositionReducer,
  },
});
