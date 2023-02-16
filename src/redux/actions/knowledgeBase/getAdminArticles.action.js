import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetAdminArticles = {
    getAdminArticles: { data: [
      {
        'id': 'art1',
        'name': 'Сверхзвуковые волны',
        'content': 'СВЕРХЗВУКОВАЯ ВОЛНА, волна, порождаемая в воздухе любым объектом, движущимся со СВЕРХЗВУКОВОЙ СКОРОСТЬЮ. При таких скоростях звуковые волны, создаваемые движущимся объектом, накапливаются впереди него и с силой выбрасываются позади него в виде УДАРНОЙ волны. Наблюдатели, находящиеся на земле, видят, как сверхзвуковой самолет пролетает над головой до того, как ударная волна распространится и достигнет их в виде ЗВУКОВОГО УДАРА',
        'markId': ['mark1', 'mark2'],
        'employeeId': ['em1', 'em2'],
        'sectionId': 'sec1',
        'date': '12.12.2022',
        'active': true,
        'section': 'Физ',
        'sectionGroup': 'Физ2.0'
      },
      {
        'id': 'art2',
        'name': 'Как качаться на волнах',
        'content': 'Погрузившись в воду, ухватитесь руками за борт бассейна или за пирс, если вы в море, расслабьте ноги и позвольте им всплыть. Проделайте то же самое, перевернувшись на спину и на бок, до тех пор пока не почувствуете, что вы достаточно хорошо управляете своим телом в такой позиции.',
        'markId': ['mark3', 'mark2'],
        'employeeId': ['em1', 'em3'],
        'sectionId': 'sec2',
        'date': '12.12.2022',
        'section': 'пл',
        'sectionGroup': 'пл2.0'
      },
      {
        'id': 'art3',
        'name': 'Как качаться на волнах2',
        'content': '22Погрузившись в воду, ухватитесь руками за борт бассейна или за пирс, если вы в море, расслабьте ноги и позвольте им всплыть. Проделайте то же самое, перевернувшись на спину и на бок, до тех пор пока не почувствуете, что вы достаточно хорошо управляете своим телом в такой позиции.',
        'markId': ['mark3', 'mark2'],
        'employeeId': ['em1', 'em3'],
        'sectionId': 'sec2',
        'date': '12.12.2022',
        'section': 'пл',
        'sectionGroup': 'пл2.0'
      },
      {
        'id': 'art4',
        'name': 'Как качаться на волнах3',
        'content': '22Погрузившись в воду, ухватитесь руками за борт бассейна или за пирс, если вы в море, расслабьте ноги и позвольте им всплыть. Проделайте то же самое, перевернувшись на спину и на бок, до тех пор пока не почувствуете, что вы достаточно хорошо управляете своим телом в такой позиции.',
        'markId': ['mark3', 'mark2'],
        'employeeId': ['em1', 'em2'],
        'sectionId': 'sec2',
        'date': '12.12.2022',
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