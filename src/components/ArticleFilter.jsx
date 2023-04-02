import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, Collapse } from 'antd';
// получаем должности 
// получаем метки 
// функция articleFilter диспатчим, и отбираем нужные нам


const ArticleFilter = () => {

    let element = (
        <div className='article-filter'>
            <div className='article-filter__name'>Фильтры</div>
            <div className="modal__select article-filter__multiple-select">
                <Select mode='multiple' placeholder="Метки" >
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