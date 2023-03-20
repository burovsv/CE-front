import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateUploadArticleFile = {
    uploadArticleFile: { data: null, loading: false, error: null },
};

export const uploadArticleFile = createAsyncThunk('/article/file/upload', async ({file, isMain, articleId, type}, { rejectWithValue, fulfillWithValue }) => {

    let formData = new FormData();
    formData.append('file', file);
    formData.append('isMain', isMain);
    formData.append('articleId', articleId);
    formData.append('type', type);

    return await axios
        .post(`${process.env.REACT_APP_SERVER_API}/article/file/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
              }
        })
        .then((res) => {
            return fulfillWithValue(res.data);
        })
        .catch((res) => {
            return rejectWithValue(res.response.data);
        });
});

export const reducerUploadArticleFile = {
    [uploadArticleFile.pending]: (state) => {
        state.uploadArticleFile.loading = true;
        state.uploadArticleFile.success = false;
    },
    [uploadArticleFile.fulfilled]: (state, action) => {
        state.uploadArticleFile.loading = false;
        state.uploadArticleFile.data = action.payload;
        state.uploadArticleFile.error = null;
        state.uploadArticleFile.success = true;
    },
    [uploadArticleFile.rejected]: (state, action) => {
        state.uploadArticleFile.loading = false;
        state.uploadArticleFile.error = action.payload;
        state.uploadArticleFile.success = false;
    }
};