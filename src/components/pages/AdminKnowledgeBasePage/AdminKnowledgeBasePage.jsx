import React, { useEffect, useState } from 'react';
import Table from '../../Table';

import { useDispatch, useSelector } from 'react-redux';
import { getArticles } from '../../../redux/actions/knowledgeBase/getArticles.action';
import { getOneArticle } from '../../../redux/actions/knowledgeBase/getOneArticle.action';

import { getSections } from '../../../redux/actions/knowledgeBase/getSections.action';
import { getSectionGroups } from '../../../redux/actions/knowledgeBase/getSectionGroups.action';
import { setActiveModal } from '../../../redux/slices/app.slice';

import { resetGetSections } from '../../../redux/slices/section.slice';
import { resetGetSectionGroups } from '../../../redux/slices/sectionGroup.slice';
import { resetGetArticles } from '../../../redux/slices/article.slice';

import ModalArticle from '../../modals/ModalArticle/ModalArticle';

const AdminKnowledgeBasePage = () => {
  const [viewData, setViewData] = useState([]);
  const { activeModal } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const {
    getArticles: { data: articles, loading: loadingArticles, success: successArticle, error, count: articlesCount },
    getOneArticle: { data: oneArticleData, loading: oneArticleDataLoading },
  } = useSelector((state) => state.article)
  const {
    getSections: { data: sections, loading: loadingSection, success: successSection, error: errorSection, count: sectionCount }
  } = useSelector((state) => state.section);

  const {
    getSectionGroups: { data: sectionGroups, loading: loadingSectionGroup, success: successSectionGroup, error: errorSectionGroup, count: sectionGroupCount },
  } = useSelector((state) => state.sectionGroup);

  useEffect(() => {
    dispatch(getArticles());
    dispatch(getSectionGroups());
    dispatch(getSections());

    return () => {
      dispatch(resetGetArticles());
      dispatch(resetGetSectionGroups());
      dispatch(resetGetSections());
    }
  }, [activeModal, oneArticleDataLoading, ModalArticle])

  useEffect(() => {
    if (articles && sections && sectionGroups && !activeModal) {
      let Articles = articles?.map((article) => {
        const sectionArticle = sections.find((section) => section.id === article?.sectionId);
        const sectionGroupArticle = sectionGroups?.find((sectionGroup) => sectionGroup?.id === sectionArticle.sectionGroupId);
        return {
          ...article,
          sectionName: sectionArticle?.name,
          sectionGroupName: sectionGroupArticle?.name,
        }
      });
      setViewData(Articles)
    }


  }, [articles, sections, sectionGroups])

  const header = [
    {
      title: 'Дата',
      prop: 'date'
    },
    {
      title: 'Статья',
      prop: 'name'
    },
    { title: 'Раздел', prop: 'sectionName' },

    {
      title: 'Группа',
      prop: 'sectionGroupName'
    },
  ];

  let element = (
    <div>
      <Table
        header={header}
        data={viewData}
        onAdd={() => dispatch(setActiveModal('modal-knowledgeBase'))}
        addBtnText="Добавить"
        onEdit={(val) => {
          dispatch(setActiveModal('modal-knowledgeBase'));
          dispatch(getOneArticle({ id: val?.id }));
        }}
      />
      {activeModal === 'modal-knowledgeBase' && <ModalArticle />}
    </div>
  );
  return element;
}

export default AdminKnowledgeBasePage;