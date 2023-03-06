import React from "react";
import * as _ from "lodash";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router';
import { addYouTubeIframe } from '../../utils/addYouTubeIframe';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

import { getArticlesUser } from '../../redux/actions/knowledgeBase/getArticlesUser.action';
import { getMarks } from '../../redux/actions/knowledgeBase/getMarks.action';
import { getSections } from '../../redux/actions/knowledgeBase/getSections.action';
import { getSectionGroups } from '../../redux/actions/knowledgeBase/getSectionGroups.action';


const KnowledgeBaseSinglePage = () => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [section, setSection] = useState('');
    const [sectionGroup, setSectionGroup] = useState('');
    const [articleMarks, setArticleMarks] = useState([]);

    const { knowledgeBaseId } = useParams();

    const {
        getArticlesUser: { data: articles, loading: loadingArticlesUser, error: errorArticlesUser }
    } = useSelector((state) => state.article);
    
    const {
        getMarks: { data: marks, loading: loadingMarks, error: errorMarks, count: marksCount }
    } = useSelector((state) => state.mark);
        
    const {
        getSections:  { data: sections, loading: loadingSection, error: errorSection, count: sectionCount }
    } = useSelector((state) => state.section);

    const {
        getSectionGroups:  { data: sectionGroups, loading: loadingSectionGroup, error: errorSectionGroup, count: sectionGroupCount }
    } = useSelector((state) => state.sectionGroup);

    const dispatch = useDispatch();

    useEffect(() => {
        // инициализируем данные из бд
        dispatch(getArticlesUser());
        dispatch(getMarks());
        dispatch(getSections());
        dispatch(getSectionGroups());
    }, []);


    useEffect(() => {
        if (!articles) return
        let article = articles.find(el => el.id == knowledgeBaseId);
        let sectionGroupId = article?.section?.sectionGroupId;

        let sectionGroup = sectionGroups.find(group => group.id == sectionGroupId );
        let articleMarks = article?.marks ?? [];

        setName(article.name);
        setDate(article.date);
        setDescription(article.content);
        setSection(article?.section?.name);
        setSectionGroup(sectionGroup.name);
        setArticleMarks(articleMarks);


    }, [articles]);

    const element = (
        <div
            style={{
                color: '#1e2d2d',
                height: '100%',
                backgroundColor: 'white',
                marginTop: '20px',
                padding: '20px',
            }}
        >
            <div style={{marginBottom: '20px'}}>
                <ArrowLeftOutlined />
                <Link to={`/knowledgeBase`} style={{marginLeft: '5px', color: 'black'}}>Назад</Link>
            </div>
            <h2>Статья: {name}</h2>
            <div style={{marginLeft: '20px', color: '#909090'}}>
                <div style={{marginTop: '10px'}}>Группа: {sectionGroup}</div>
                <div style={{marginTop: '10px'}}>Раздел: {section}</div>
                <div style={{marginTop: '10px'}}>Метки: {articleMarks.map((mark, index) => {                // песли последний элемент запяту не ставим
                    if (index === articleMarks.length - 1) {
                        return <span id={index}>{mark.name}</span>
                    } else {
                    return <span id={index}>{mark.name}, </span>
                    }})} 
                </div>
            </div>
            <div style={{
                marginTop: '20px',
                lineHeight: '1.6',
                // fontSize: '1.2rem',
                textAlign: 'justify',
        
            }}>
                <div dangerouslySetInnerHTML={{ __html: addYouTubeIframe(description) }} />
            </div>


        </div>
    )


    return element;
}

export default KnowledgeBaseSinglePage;