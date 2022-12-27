import React from "react";
import * as _ from "lodash";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router';


const KnowledgeBaseSinglePage = () => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [section, setSection] = useState('');
    const [sectionGroup, setSectionGroup] = useState('');
    const [articleMarks, setArticleMarks] = useState([]);

    const { knowledgeBaseId } = useParams();


    const {
        getAdminArticles: { data: articles, loading: loadingArticles, error: errorArticles, count: articlesCount }
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



    useEffect(() => {
        console.log(knowledgeBaseId);
        console.log(articles);
        let article = _.find(articles, (el) => el.id === knowledgeBaseId);
        let marksList = [];
        _.forEach(article.markId, (markId) => {
            let mark = _.find(marks, (el) => el.id === markId);
            marksList.push(mark);
        });

        let articleSection = _.find(sections, (el) => el.id === article.sectionId);
        let articleSectionGroup = _.find(sectionGroups, (el) => el.id === articleSection.sectionGroup);

        console.log(article, marksList, articleSection, articleSectionGroup);


        setName(article.name);
        setDate(article.date);
        setDescription(article.content);
        setSection(articleSection.name);
        setSectionGroup(articleSectionGroup.name);
        setArticleMarks(marksList);


    }, [knowledgeBaseId]);

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
                lineHeight: '1.8',
                fontSize: '1.2rem',
                textAlign: 'justify',
        
            }}>{description}</div>


        </div>
    )


    return element;
}

export default KnowledgeBaseSinglePage;