import * as _ from 'lodash';
import '../../css/knowledgeBase.css';

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getArticles } from '../../redux/actions/knowledgeBase/getArticles.action';
import { getArticlesUser } from '../../redux/actions/knowledgeBase/getArticlesUser.action';
import { getMarks } from '../../redux/actions/knowledgeBase/getMarks.action';
import { getSections } from '../../redux/actions/knowledgeBase/getSections.action';
import { getSectionGroups } from '../../redux/actions/knowledgeBase/getSectionGroups.action';
import { Link } from 'react-router-dom';



const KnowledgeBasePage = () => {

    const [articlesList, setArticlesList] = useState([]);
    const [marksList, setMarksList] = useState([]);
    const [sectionsList, setSectionsList] = useState([]);
    const [sectionGroupsList, setSectionGroupsList] = useState([]);
    let [sectionGroupsElement, setSectionGroupsElement] = useState([]);
    let [initHierarchicalList, setInitHierarchicalList] = useState([]);

    const onSectionGroupClick = (e, group) => {
        let hierarchicalList = _.cloneDeep(initHierarchicalList);
        let foundGroup = _.find(hierarchicalList, { id: group.id, level: group.level });
        let isCollapsed = !foundGroup?.isCollapsed
        foundGroup.isCollapsed = isCollapsed;
        foundGroup.isHide = false;

        if (foundGroup?.children) {
            _.forEach(foundGroup.children, (child) => {
                child.isHide = isCollapsed;
                child.isCollapsed = isCollapsed;
            });
        }

        setInitHierarchicalList(hierarchicalList);
    }

    const sectionGroupElement = (sectionGroup) => {
        const element = (
            <div onClick={(e) => onSectionGroupClick(e, sectionGroup)} className="knowledge-base__section-group-container">
                {sectionGroup?.name}
            </div>
        );
        return element;
    };

    const sectionElement = (section) => {
        let result = (section?.children) ? section.children.length : 0;
        const element = (
            <div onClick={(e) => onSectionGroupClick(e, section)} style={{
                backgroundColor: '#E7E7E7',
                padding: '10px 40px',
                display: 'flex',
            }}>
                <div style={{
                    fontWeight: 700,
                    fontSize: '12px'
                }}>
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
        let foundArticle = _.find(articles, { id: article.id });
        let articlesMarks = [];
        // _.forEach(foundArticle.markId, (mark) => {
        //     let foundMark = _.find(marks, { id: mark });
        //     articlesMarks.push(foundMark);
        // });

        const element = (
            <div style={{
                padding: '10px 10px 10px 60px',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                }}>
                    <Link to={`/knowledgeBase/${article?.id}`} style={{
                        fontWeight: 700,
                        color: 'blue',
                    }} onClick={() => onClick(article)}>
                        {article?.name ?? ''}
                    </Link>
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
                        {articlesMarks.map((mark, index) => {
                            // на последний элемент не ставим запятую
                            return (
                                <span>
                                    {mark?.name}{(index === articlesMarks.length - 1) ? '' : ', '}
                                </span>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
        return element;
    };

    const initHierarchicalItem = (el, level, parent = null, isGroup = false, isCollapsed = false) => {
        return {
            id: el.id,
            name: el.name,
            parent: parent,
            isGroup: isGroup,
            isCollapsed: isCollapsed,
            level: level,
            children: (el?.children) ? el.children : null,
        }
    }

    const {
        getArticles: { data: articles, loading: loadingArticles, error: errorArticles, count: articlesCount },
        getArticlesUser: { data: articlesUser, loading: loadingArticlesUser, error: errorArticlesUser }
    } = useSelector((state) => state.article);

    const {
        getMarks: { data: marks, loading: loadingMarks, error: errorMarks, count: marksCount }
    } = useSelector((state) => state.mark);

    const {
        getSections: { data: sections, loading: loadingSection, error: errorSection, count: sectionCount }
    } = useSelector((state) => state.section);

    const {
        getSectionGroups: { data: sectionGroups, loading: loadingSectionGroup, error: errorSectionGroup, count: sectionGroupCount }
    } = useSelector((state) => state.sectionGroup);

    const dispatch = useDispatch();

    useEffect(() => {
        // инициализируем данные из бд
        dispatch(getArticlesUser());
        dispatch(getMarks());
        dispatch(getSections());
        dispatch(getSectionGroups());
    }, []);

    const onClick = (e) => {
        // console.log('click: ', e);
    }
    // определяем массивы статей, разделов и групп разделов
    useEffect(() => {
        if (!articlesUser || !sections || !sectionGroups) return;
        console.log('ехн')
        let articlesArray = (!_.isEmpty(articlesList)) ? articlesList : [];
        let sectionsArray = (!_.isEmpty(sectionsList)) ? sectionsList : [];
        let sectionGroupsArray = (!_.isEmpty(sectionGroupsList)) ? sectionGroupsList : [];

        if (_.isEmpty(articlesList)) {
            articlesArray = articlesUser.map((el) => initHierarchicalItem(el, 2, el.sectionId))
            setArticlesList(articlesArray);
        }
        if (_.isEmpty(sectionsList)) {
            sectionsArray = sections.map((el) => initHierarchicalItem(el, 1, el.sectionGroupId, true))
            setSectionsList(sectionsArray);
        }
        if (_.isEmpty(sectionGroupsList)) {
            sectionGroupsArray = sectionGroups.map((el) => initHierarchicalItem(el, 0, null, true))
            setSectionGroupsList(sectionGroupsArray);
        }

        console.log(articlesUser)
        console.log(sectionGroups)
        console.log(sections)
        console.log(marks)
        /*
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
                    if (!_.isEmpty(sectionChildren)) {
                        section.children = sectionChildren;
                        sectionGroupChildren.push(section, ...sectionChildren)
                        sectionGroup.children = sectionGroupChildren;
                    };
                }
            });
            if (!_.isEmpty(sectionGroupChildren)) hierarchicalList.push(sectionGroup, ...sectionGroupChildren);

        });

        setInitHierarchicalList(hierarchicalList);
    }, [articlesUser, sections, sectionGroups, marks])


    useEffect(() => {
        function createHierarchicalList() {
            let hierarchicalList = [];
            hierarchicalList = initHierarchicalList.map((el) => {
                if (el?.isCollapsed && el?.isHide) return null;
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
            console.log('hierart', hierarchicalList)
            return hierarchicalList;
        }

        console.log(createHierarchicalList())

        setSectionGroupsElement(createHierarchicalList())
    }, [initHierarchicalList])

    useEffect(() => {

        console.log(initHierarchicalList);

        console.log(sectionGroupsElement)

    }, [sectionGroupsElement])

    let element = (
        <div
            style={{
                userSelect: 'none',
                WebkitUserDrag: 'none',
                WebkitTouchCallout: 'none',
            }}
        >
            {sectionGroupsElement}
        </div>
    )
    return element;
}

export default KnowledgeBasePage;