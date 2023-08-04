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

import { createHierarchicalList, collapseHierarchicalGroup, initHierarchicalItem } from "./scripts/utils"

import { SectionGroupElement, SectionElement, ArticleElement } from './components';

const KnowledgeBasePage = () => {

    const [articlesList, setArticlesList] = useState([]);
    const [sectionsList, setSectionsList] = useState([]);
    const [sectionGroupsList, setSectionGroupsList] = useState([]);
    const [sectionGroupsElement, setSectionGroupsElement] = useState([]);

    const [initHierarchicalList, setInitHierarchicalList] = useState([]);

    const onSectionGroupClick = useCallback((group) => {
        const hierarchicalList = collapseHierarchicalGroup(group, initHierarchicalList)
        setInitHierarchicalList(hierarchicalList);
    }, [initHierarchicalList])

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
    const getArticleSearch = useSelector((state) => state.articleSearch)
    const dispatch = useDispatch();

    useEffect(() => {
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

        const articlesArray = (!_.isEmpty(articlesList)) ? articlesList : articlesUser.map((el) => initHierarchicalItem(el, 2, el.sectionId));
        const sectionsArray = (!_.isEmpty(sectionsList)) ? sectionsList : sections.map((el) => initHierarchicalItem(el, 1, el.sectionGroupId, true));
        const sectionGroupsArray = (!_.isEmpty(sectionGroupsList)) ? sectionGroupsList : sectionGroups.map((el) => initHierarchicalItem(el, 0, null, true));

        if (_.isEmpty(articlesList)) {
            setArticlesList(articlesArray);
        }
        if (_.isEmpty(sectionsList)) {
            setSectionsList(sectionsArray);
        }
        if (_.isEmpty(sectionGroupsList)) {
            setSectionGroupsList(sectionGroupsArray);
        }

        const hierarchicalList = createHierarchicalList(sectionGroupsArray, sectionsArray, articlesArray);
        setInitHierarchicalList(hierarchicalList);
    }, [articlesUser, sections, sectionGroups, marks])

    useEffect(() => {
        const marksForFilter = getFilterMarks.value.map(el => ({ id: el }));
        const employeePositionsForFilter = getFilterEmployeePositions.value.map(el => ({ id: el }));

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

        if (!_.isEmpty(getArticleSearch)) {
            const text = getArticleSearch.value.toUpperCase();
            filteringArticlesArray = _.filter(filteringArticlesArray, el => el.name.toUpperCase().includes(text));
        }

        const hierarchicalList = createHierarchicalList(sectionGroupsList, sectionsList, filteringArticlesArray);
        setInitHierarchicalList(hierarchicalList);
    }, [getFilterMarks, getFilterEmployeePositions, getArticleSearch])

    const createHierarchicalElementList = useCallback(() => {
        const newHierarchicalList = initHierarchicalList.map((el) => {
            if (el?.isCollapsed && el?.isHide) return null;
            switch (el.level) {
                case 0:
                    return <SectionGroupElement sectionGroup={el} onSectionGroupClickHandler={onSectionGroupClick} />
                case 1:
                    return <SectionElement section={el} onSectionGroupClickHandler={onSectionGroupClick} />
                case 2:
                    return <ArticleElement article={el} />;
                default:
                    return null;
            }
        });
        return newHierarchicalList;
    }, [initHierarchicalList, onSectionGroupClick])

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