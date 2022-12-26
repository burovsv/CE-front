import * as _ from 'lodash';
import '../../css/knowledgeBase.css';

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getAdminArticles } from '../../redux/actions/knowledgeBase/getAdminArticles.action';
import { getMarks } from '../../redux/actions/knowledgeBase/getMarks.action';
import { getSections } from '../../redux/actions/knowledgeBase/getSections.action';
import { getSectionGroups } from '../../redux/actions/knowledgeBase/getSectionGroups.action';


const KnowledgeBasePage = () => {

    const [articlesList, setArticlesList] = useState([]);
    const [marksList, setMarksList] = useState([]);
    const [sectionsList, setSectionsList] = useState([]);
    const [sectionGroupsList, setSectionGroupsList] = useState([]);
    let [sectionGroupsElement, setSectionGroupsElement] = useState([]);

    const sectionGroupElement = (sectionGroup) => {
        const element = (
            <div style={{
                        backgroundColor: 'white',
                        padding: '10px 20px',
                        fontWeight: 700,
                        fontSize: '12px',
                        marginTop: '20px',
                        display: 'flex',

                    }}>
                {sectionGroup?.name}
            </div>
        );
        return element;
    };

    const sectionElement = (section, result = 0) => {
        const element = (
            <div style={{
                        backgroundColor: '#E7E7E7',
                        padding: '10px 40px',
                        display: 'flex',
                    }}>
                <div style={{
                        fontWeight: 700,
                        fontSize: '12px'}}>
                    {section?.name}
                </div>
                <div style={{
                        fontWeight: 400,
                        color: '#00000080',
                        fontSize: '12px',
                        paddingLeft: '10px',

                        }}>
                    Результаты: {result}
                </div>
            </div>
        );
        return element;
    };

    const articleElement = (article) => {
        const element = (
            <div style={{
                    padding: '10px 10px 10px 60px',
                    }}>
                <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                }}>
                    <div style={{
                        fontWeight: 700,
                        color: 'blue',
                    }} onClick={() => onClick(article)}>
                        {article?.name??''}
                    </div>
                    <div style={{
                        color: '#00000080',
                    }}>
                        26.12.2022
                    </div>
                </div>
                <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                }}>
                    <div>
                        Метки: 
                    </div>
                    <div style={{
                        color: '#00000080',
                        marginLeft: '5px',
                    }}>
                        код, Спорт
                    </div>
                </div>
            </div>
        );
        return element;
    };

    const initHierarchicalItem = (el, level, parent=null, isGroup=false, isCollapsed=false) => {
        return {
            id: el.id,
            name: el.name,
            parent: parent,
            isGroup: isGroup,
            isCollapsed: isCollapsed,
            level: level,
        }
    } 

    const dispatch = useDispatch();
    // const {
    //   getAdminArticles: { data: articles, loading, error, count: articlesCount },
    //   // createArticle: { data: createArticleData, loading: createArticleLoading },
    //   // updateArticle: { data: updateArticleData, loading: updateArticleLoading },
    //   // deleteArticle: { data: deleteArticleData, loading: deleteArticleLoading },
    // } = useSelector((state) => state.article)

    // const {
    //     getMarks:  {data: marks, loading, error, count: marksCount }
    // } = useSelector((state) => state.mark)

    // получаем статьи, метки, разделы и группы разделов

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


    const onClick = (e) => {
        console.log('click: ', e);
    }
    // определяем массивы статей, разделов и групп разделов

    useEffect(() => {
        let articlesArray = (!_.isEmpty(articlesList))? articlesList : [];
        let sectionsArray = (!_.isEmpty(sectionsList))? sectionsList : [];
        let sectionGroupsArray = (!_.isEmpty(sectionGroupsList))? sectionGroupsList : [];

        if (_.isEmpty(articlesList)) {
            articlesArray = articles.map((el) => initHierarchicalItem(el, 2, el.sectionId))
            setArticlesList(articlesArray);
        }
        if (_.isEmpty(sectionsList)) {
            sectionsArray = sections.map((el) => initHierarchicalItem(el, 1, el.sectionGroup, true))
            setSectionsList(sectionsArray);
        }
        if (_.isEmpty(sectionGroupsList)) {
            sectionGroupsArray = sectionGroups.map((el) => initHierarchicalItem(el, 0, null, true))
            setSectionGroupsList(sectionGroupsArray);
        }

        /*
        console.log(articles)
        console.log(sectionGroups)
        console.log(sections)
        console.log(marks)

        console.log(articlesArray);
        console.log(sectionsArray);
        console.log(sectionGroupsArray);
        */

        //   создать массив иерархических групп разделов

        let hierarchicalList = [];

        _.forEach(sectionGroupsArray, (sectionGroup) => {
            let id = sectionGroup.id;
            let sectionGroupChildren = [];
            _.forEach(sectionsArray, (section) => {
                if (section.parent == id) {
                    let sectionChildren = [];
                    _.forEach(articlesArray, (article) => {
                        if (article.parent == section.id) sectionChildren.push(article);
                    })
                    if (!_.isEmpty(sectionChildren)) sectionGroupChildren.push(section, ...sectionChildren);
                }
            });
            if (!_.isEmpty(sectionGroupChildren)) hierarchicalList.push(sectionGroup, ...sectionGroupChildren);
        })

        let groupsList = hierarchicalList.map( (el) => {
            switch (el.level) {
                case 0: 
                    return sectionGroupElement(el);
                case 1:
                    return sectionElement(el);
                case 2:
                    return articleElement(el);
                default:
                    return null;
            }
        });

        setSectionGroupsElement(groupsList);
    }, [articles, sectionGroups, sections, marks])

    let element = (
        <>
            Здесь будет база знаний
            {sectionGroupsElement}
        </>
    )
    return element;
}

export default KnowledgeBasePage;