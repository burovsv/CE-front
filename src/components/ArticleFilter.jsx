import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, } from 'react-redux';
import { Select, Collapse } from 'antd';

import { store } from '../redux/store';

import { getMarks } from '../redux/actions/knowledgeBase/getMarks.action';
import { resetGetMarks } from '../redux/slices/mark.slice';
import { reducergetCatsByPostAndSubdiv } from '../redux/actions/category/getCatsByPostAndSubdiv';
import { setArticleFilterMarks } from '../redux/slices/articleFilterByMarks';
import { articleFilterByMarksReducer } from '../redux/slices/articleFilterByMarks';




// получаем должности 
// получаем метки 
// функция articleFilter диспатчим, и отбираем нужные нам


const ArticleFilter = () => {
    const [marksList, setMarksList] = useState([]);

    const {
        getMarks: { data: marks, loading: loadingMarks, error: errorMarks, count: marksCount }
    } = useSelector((state) => state.mark);

    const dispatch = useDispatch();

    useEffect(() => {
        // инициализируем данные из бд
        dispatch(getMarks());

        console.log('art files', marks);

        return () => {
            dispatch(resetGetMarks());
        }
    }, []);


    useEffect(() => {
        if (!marks) return
        console.log('marks', marks);
        const marksOptions = marks.map(el => (
            {
                value: el.id,
                label: el.name
            }
        ))
        setMarksList(marksOptions);
    }, [marks])

    const onMarksChange = (el) => {
        dispatch(setArticleFilterMarks(el))
    }

    let element = (
        <div className='article-filter'>
            <div className='article-filter__name'>Фильтры</div>
            <div className="modal__select article-filter__multiple-select">
                <Select mode='multiple' placeholder="Метки" onChange={onMarksChange} options={marksList} >
                    {/* <Select options={optionsMarks} value={articleMarks} mode='multiple'  placeholder="Выберите метки" > */}
                </Select>
            </div>
            <div className="modal__select article-filter__multiple-select">
                <Select mode='multiple' placeholder="Должности" >
                    {/* <Select options={optionsMarks} value={articleMarks} mode='multiple'  placeholder="Выберите метки" > */}
                </Select>
            </div>

        </div>
    )

    return element

}

export default ArticleFilter;