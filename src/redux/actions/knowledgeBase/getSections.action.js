import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetSections = {
    getSections: { data: [
      {
        id: 'sec1',
        name: 'Физика',
        sectionGroup: 'gr1'
      },
      {
          id: 'sec2',
          name: 'Разные развлечения',
          sectionGroup: 'gr2'
      },
      {
          id: 'sec3',
          name: 'Купательные мероприятия',
          sectionGroup: 'gr2'
      }
    ], loading: false, error: null }
}

export const getSections = () => {
    return initStateGetSections.getSections;
}


export const reducerGetSections = {
    [getSections.pending]: (state) => {
      state.getSections.loading = true;
    },
    [getSections.fulfilled]: (state, action) => {
      state.getSections.loading = false;
      state.getSections.data = action.payload.list;
      state.getSections.count = action.payload.count;
  
      state.getSections.error = null;
    },
    [getSections.rejected]: (state, action) => {
      state.getSections.loading = false;
      state.getSections.error = action.payload;
    },
  };