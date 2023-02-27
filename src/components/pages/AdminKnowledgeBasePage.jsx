import React, { useEffect, useState } from 'react';
import Table from '../Table';
import { useDispatch, useSelector } from 'react-redux';
import { getArticles } from '../../redux/actions/knowledgeBase/getArticles.action';
import { getSections } from '../../redux/actions/knowledgeBase/getSections.action';
import { getSectionGroups } from '../../redux/actions/knowledgeBase/getSectionGroups.action';
import { setActiveModal } from '../../redux/slices/app.slice';
import ModalArticle from '../modals/ModalArticle';
import ModalTesting from '../modals/ModalTesting';


import moment from 'moment';
import { resetCreateTesting, resetGetAdminTesting, resetUpdateTesting } from '../../redux/slices/testing.slice';
import Loading from '../Loading';
import { getAdminTestingSingle } from '../../redux/actions/testing/getAdminTestingSingle.action';
import { deleteTesting } from '../../redux/actions/testing/deleteTesting.action';

const AdminKnowledgeBasePage = () => {
  const [paramsData, setParamsData] = useState({ page: 1, search: '' });
  const [viewData, setViewData] = useState([]);
  const { activeModal } = useSelector((state) => state.app);

  
  const dispatch = useDispatch();
  const {
    getArticles: { data: articles, loading, error, count: articlesCount },
    // createArticle: { data: createArticleData, loading: createArticleLoading },
    // updateArticle: { data: updateArticleData, loading: updateArticleLoading },
    // deleteArticle: { data: deleteArticleData, loading: deleteArticleLoading },
  } = useSelector((state) => state.article)
  const {
    getSections:  { data: sections, loading: loadingSection, error: errorSection, count: sectionCount }
  } = useSelector((state) => state.section);

  const {
    getSectionGroups:  { data: sectionGroups, loading: loadingSectionGroup, error: errorSectionGroup, count: sectionGroupCount }
  } = useSelector((state) => state.sectionGroup);

  useEffect(() => {
    // добаить еще раздел и группу
    let Articles = articles?.map((article) => {
      let section = sections?.find((section) => section?.id === article?.sectionId);
      let sectionGroup = sectionGroups?.find((sectionGroup) => sectionGroup?.id === section?.sectionGroup);
      return {
        ...article,
        sectionName: section?.name,
        sectionGroupName: sectionGroup?.name,
      }
    })

    setViewData(Articles)
  }, [articles])

    const header = [
        {
          title: 'Дата',
          prop: 'date',
          // onChange: (val) => {
          //   // return moment(val).format('DD.MM.YYYY');
          // },
        },
        {
          title: 'Статья',
          prop: 'name',
          // onChange: (val) => {
          //   // return moment(val).format('DD.MM.YYYY');
          // },
        },
        { title: 'Раздел', prop: 'sectionName'},
    
        {
          title: 'Группа',
          prop: 'sectionGroupName'
          // onChange: (val) => {
          //   // return val?.categories?.map((cat) => <div>{cat?.name}</div>);
          // },
        },
      ];

    let element = (
        <div>
          <Table
            // pages={testingCount}
            // loading={loading}
            header={header}
            data={viewData}
            // onMore={() => setParamsData({ page: paramsData?.page + 1, search: paramsData?.search })}
            onAdd={() => dispatch(setActiveModal('modal-knowledgeBase'))}
            addBtnText="Добавить"
            // subText={testingSuccess && 'Новость добавлена'}
            // onSearch={(term) => setParamsData({ page: 1, search: term })}
            onEdit={(val) => {
              dispatch(setActiveModal('modal-knowledgeBase'));
            //   dispatch(getAdminTestingSingle({ id: val?.id }));
            }}
            // onDelete={(val) => dispatch(deleteTesting({ testingId: val?.id }))}
            onDelete={(val) => console.log('удалаяем статью', val)}
          />
          {activeModal === 'modal-knowledgeBase' && <ModalArticle />}
          {/* {(createTestingLoading || deleteTestingLoading || updateTestingLoading) && <Loading overlay />} */}
        </div>
      );
    return element;
}

export default AdminKnowledgeBasePage;