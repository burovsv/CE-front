import { createSlice } from '@reduxjs/toolkit';
import { initStateUploadArticleFile, reducerUploadArticleFile} from '../actions/knowledgeBase/uploadArticleFile.action';


export const initialState = {
    ...initStateUploadArticleFile,
  };
  
export const uploadArticleFileSlice = createSlice({
    name: 'uploadArticleFile',
    initialState,
    reducers: {
      resetUploadArticleFile(state) {
        state.uploadArticleFile = initStateUploadArticleFile.uploadArticleFile;
      },
    },
    extraReducers: {
      ...reducerUploadArticleFile,
    },
  });
  export const { resetUploadArticleFile } = uploadArticleFileSlice.actions;
  export const uploadArticleFileReducer = uploadArticleFileSlice.reducer;