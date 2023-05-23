import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, } from 'react-redux';
import { Select, Collapse } from 'antd';

import { store } from '../redux/store';

import { getMarks } from '../redux/actions/knowledgeBase/getMarks.action';
import { resetGetMarks } from '../redux/slices/mark.slice';
import { setArticleFilterMarks } from '../redux/slices/articleFilterByMarks.slice';
import { setArticleFilterEmployeePositions } from '../redux/slices/articleFilterByEmployeePositions.slice';
import { authEmployee } from '../redux/actions/employee/auth.action';

import { setAuth } from '../redux/slices/app.slice';
import { getPosts } from '../redux/actions/post/getPosts.action';
import { resetGetPosts } from '../redux/slices/post.slice';






// получаем должности 
// получаем метки 
// функция articleFilter диспатчим, и отбираем нужные нам


const ArticleFilter = () => {
    const [marksList, setMarksList] = useState([]);
    const [employeePositionList, setEmployeePositionList] = useState([]);
    const { auth } = useSelector((state) => state.app);

    const {
        getPosts: { data: employeePositions, loading: loadingEmployeePositions, error: errorEmployeePositions, count: employeePositionsCount }
    } = useSelector((state) => state.post);

    const {
        getMarks: { data: marks, loading: loadingMarks, error: errorMarks, count: marksCount }
    } = useSelector((state) => state.mark);

    const dispatch = useDispatch();

    useEffect(() => {
        // инициализируем данные из бд
        dispatch(getMarks());
        dispatch(getPosts());

        return () => {
            dispatch(resetGetMarks());
            dispatch(resetGetPosts());
        }
    }, []);


    useEffect(() => {
        if (!marks) return
        const marksOptions = marks.map(el => (
            {
                value: el.id,
                label: el.name
            }
        ))
        setMarksList(marksOptions);
    }, [marks])

    useEffect(() => {
        if (!auth || !employeePositions) {
            return;
        }

        let employeeOptions = [];

        if (auth.role === "admin") {
            employeeOptions = employeePositions.map(el => (
                {
                    value: el.id,
                    label: el.name
                }
            ))
        } else {
            employeeOptions = [{
                value: auth.postSubdivision.postId,
                label: auth.post,
            }]
        }
        setEmployeePositionList(employeeOptions);
    }, [auth, employeePositions])


    const onMarksChange = (el) => {
        dispatch(setArticleFilterMarks(el))
    }

    const onEmployeePositionsChange = (el) => {
        dispatch(setArticleFilterEmployeePositions(el))
    }

    let element = (
        <div className='article-filter'>
            <div className='article-filter__name'>Фильтры</div>
            <div className="modal__select article-filter__multiple-select">
                <Select mode='multiple' placeholder="Метки" onChange={onMarksChange} options={marksList} />
            </div>
            <div className="modal__select article-filter__multiple-select">
                <Select mode='multiple' placeholder="Должности" onChange={onEmployeePositionsChange} options={employeePositionList} />
            </div>

        </div>
    )

    return element

}

export default ArticleFilter;