import * as _ from 'lodash';

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




      useEffect(() => {
          console.log(articles)
          console.log(sectionGroups)
          console.log(sections)
          console.log(marks)
          setSectionGroupsElement([])

          let groupsList = sectionGroups.map( (el) => {
                return (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '10px 20px',
                        fontWeight: 700,
                        fontSize: '12px'
                    }}>
                        {el?.name}
                    </div>
                )
          })

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