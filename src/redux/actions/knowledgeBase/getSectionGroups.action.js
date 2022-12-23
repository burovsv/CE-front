import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetSectionGroups = {
    getSectionGroups: { data: [
        {
            id: 'gr1',
            name: 'Наука',
        },
        {
            id: 'gr2',
            name: 'Корпоративные идеи',
        },
        {
            id: 'gr3',
            name: 'Программирование',
        }
    ], loading: false, error: null }
}

export const getSectionGroups = () => {
    return initStateGetSectionGroups.getSectionGroups;
}


export const reducerGetSectionGroups = {
    [getSectionGroups.pending]: (state) => {
      state.getSectionGroups.loading = true;
    },
    [getSectionGroups.fulfilled]: (state, action) => {
      state.getSectionGroups.loading = false;
      state.getSectionGroups.data = action.payload.list;
      state.getSectionGroups.count = action.payload.count;
  
      state.getSectionGroups.error = null;
    },
    [getSectionGroups.rejected]: (state, action) => {
      state.getSectionGroups.loading = false;
      state.getSectionGroups.error = action.payload;
    },
  };