import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateCreateSection = {
    createSection: { data: null, loading: false, error: null },
};

export const createSection = createAsyncThunk('section/create', async ({ name, groupId }, { rejectWithValue, fulfillWithValue }) => {
    return await axios
        .post(`${process.env.REACT_APP_SERVER_API}/section/create`, { name, sectionGroupId: groupId })
        .then((res) => {
            return fulfillWithValue(res.data);
        })
        .catch((res) => {
            return rejectWithValue(res.response.data);
        });
});

export const reducerCreateSection = {
    [createSection.pending]: (state) => {
        state.createSection.loading = true;
    },
    [createSection.fulfilled]: (state, action) => {
        state.createSection.loading = false;
        state.createSection.data = action.payload;
        state.createSection.error = null;
    },
    [createSection.rejected]: (state, action) => {
        state.createSection.loading = false;
        state.createSection.error = action.payload;
    }
};
