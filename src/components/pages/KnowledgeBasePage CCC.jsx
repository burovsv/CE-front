import * as _ from 'lodash';
import '../../css/knowledgeBase.css';

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getArticlesUser } from '../../redux/actions/knowledgeBase/getArticlesUser.action';

const KnowledgeBasePage = () => {
    const {
        getArticlesUser: { data: articlesUser, loading: loadingArticlesUser, error: errorArticlesUser}
    } = useSelector((state) => state.article);

    const dispatch = useDispatch();

    useEffect(() => {
// Инициализируем данные
        dispatch(getArticlesUser());
        
    }, []);

    useEffect(() => {
        console.log('aaaaaaaaaaaaaaaaaaa', articlesUser);
    }, [articlesUser])

    return (
        <div>
            sssff
        </div>
    )
}

export default KnowledgeBasePage;