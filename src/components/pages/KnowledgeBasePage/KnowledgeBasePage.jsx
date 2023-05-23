import * as _ from 'lodash';
import '../../../css/knowledgeBase.css';

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getArticlesUser } from '../../../redux/actions/knowledgeBase/getArticlesUser.action';
import { getMarks } from '../../../redux/actions/knowledgeBase/getMarks.action';
import { getSections } from '../../../redux/actions/knowledgeBase/getSections.action';
import { getSectionGroups } from '../../../redux/actions/knowledgeBase/getSectionGroups.action';

import { resetGetArticlesUser } from '../../../redux/slices/article.slice';
import { resetGetMarks } from '../../../redux/slices/mark.slice';
import { resetGetSectionGroups } from '../../../redux/slices/sectionGroup.slice';
import { resetGetSections } from '../../../redux/slices/section.slice';

import createHierarchicalList from "./scripts/createHierarchicalList"

import { Link } from 'react-router-dom';
import { log } from 'util';



const KnowledgeBasePage = () => {

    const [articlesList, setArticlesList] = useState([]);
    const [marksList, setMarksList] = useState([]);
    const [sectionsList, setSectionsList] = useState([]);
    const [sectionGroupsList, setSectionGroupsList] = useState([]);
    const [sectionGroupsElement, setSectionGroupsElement] = useState([]);

    const [initHierarchicalList, setInitHierarchicalList] = useState([]);

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
            <div className="knowledge-page__section-container" onClick={(e) => onSectionGroupClick(e, section)} >
                <div className="knowledge-page__section-name">
                    {section?.name}
                </div>
                <div className="knowledge-page__section-result" >
                    Результаты: {result}
                </div>
            </div>
        );
        return element;
    };

    const articleElement = (article) => {
        const articlesMarks = article?.data?.marks ?? [];

        const element = (
            <div className="knowledge-page__article_container">
                <div className="knowledge-page__article_name" >
                    <Link className="knowledge-page__article_link" to={`/knowledgeBase/${article?.id}`} >
                        {article?.name ?? ''}
                    </Link>
                    <div className="knowledge-page__article_date">
                        26.12.2022
                    </div>
                </div>
                <div className="knowledge-page__article_mark-container">
                    <div> Метки: </div>
                    <div className="knowledge-page__article_mark">
                        {articlesMarks.map((mark, index) => {
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
            data: el
        }
    }

    const {
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

    const getFilterMarks = useSelector((state) => state.articleFilterByMarks)
    const getFilterEmployeePositions = useSelector((state) => state.articleFilterByEmployeePositions)

    const dispatch = useDispatch();

    useEffect(() => {
        // инициализируем данные из бд
        dispatch(getArticlesUser());
        dispatch(getMarks());
        dispatch(getSections());
        dispatch(getSectionGroups());

        return () => {
            dispatch(resetGetArticlesUser());
            dispatch(resetGetMarks());
            dispatch(resetGetSections());
            dispatch(resetGetSectionGroups());
        }
    }, []);

    // определяем массивы статей, разделов и групп разделов
    useEffect(() => {
        if (!articlesUser || !sections || !sectionGroups || !_.isEmpty(initHierarchicalItem)) {
            return;
        }

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

        let hierarchicalList = createHierarchicalList(sectionGroupsArray, sectionsArray, articlesArray);
        setInitHierarchicalList(hierarchicalList);
    }, [articlesUser, sections, sectionGroups, marks])

    useEffect(() => {
        let marksForFilter = getFilterMarks.value.map(el => ({ id: el }));
        let employeePositionsForFilter = getFilterEmployeePositions.value.map(el => ({ id: el }));

        let filteringArticlesArray = _.cloneDeep(articlesList);

        if (marksForFilter) {
            filteringArticlesArray = _.filter(articlesList, el => {
                return _.intersectionBy(marksForFilter, el.data.marks, "id").length === marksForFilter.length;
            });
        }

        if (employeePositionsForFilter) {
            filteringArticlesArray = _.filter(filteringArticlesArray, el => {
                return _.intersectionBy(employeePositionsForFilter, el.data.posts, "id").length === employeePositionsForFilter.length;
            });
        }

        let hierarchicalList = createHierarchicalList(sectionGroupsList, sectionsList, filteringArticlesArray);
        setInitHierarchicalList(hierarchicalList);

    }, [getFilterMarks, getFilterEmployeePositions])

    const createHierarchicalElementList = useCallback(() => {
        let newHierarchicalList = [];
        newHierarchicalList = initHierarchicalList.map((el) => {
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
        return newHierarchicalList;
    }, [initHierarchicalList])

    useEffect(() => {
        setSectionGroupsElement(createHierarchicalElementList());
    }, [initHierarchicalList])

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