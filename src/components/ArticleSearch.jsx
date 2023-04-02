import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, Collapse } from 'antd';
// получаем должности 
// получаем метки 
// функция articleFilter диспатчим, и отбираем нужные нам


const ArticleSearch = () => {

    let element = (
        <div className='article-search'>
            <input className='article-search__input' name='Поиск' placeholder='Поиск' />
        </div>
    )

    return element

}

export default ArticleSearch;