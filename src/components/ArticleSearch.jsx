import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, Collapse } from 'antd';
import { setArticleFilterMarks } from '../redux/slices/articleFilterByMarks.slice';

import { setArticleSearch } from '../redux/slices/articleSearch.slice';

const ArticleSearch = () => {
    const [text, setText] = useState('');

    const timeRef = useRef(null);
    const dispatch = useDispatch();

    const onInputChange = (e) => {
        if (timeRef.current) {
            clearTimeout(timeRef.current);
        }
        timeRef.current = setTimeout(() => {
            setText(e.target.value)
        }, 1000)
    }

    useEffect(() => {
        dispatch(setArticleSearch(text));

        return () => {
            clearTimeout(timeRef.current);
        }
    }, [text]);

    const element = (
        <div className='article-search'>
            <input className='article-search__input' name='Поиск' placeholder='Поиск' onChange={onInputChange} />
        </div>
    )

    return element

}

export default ArticleSearch;