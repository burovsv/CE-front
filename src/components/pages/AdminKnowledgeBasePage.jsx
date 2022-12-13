import React, { useEffect, useState } from 'react';
import Table from '../Table';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminArticles } from '../../redux/actions/knowledgeBase/getAdminArticles.action';
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
    getAdminArticles: { data: articles, loading, error, count: articlesCount },
    // createArticle: { data: createArticleData, loading: createArticleLoading },
    // updateArticle: { data: updateArticleData, loading: updateArticleLoading },
    // deleteArticle: { data: deleteArticleData, loading: deleteArticleLoading },
  } = useSelector((state) => state.article)

  useEffect(() => {
    console.log(articles);
    setViewData(articles)
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
        { title: 'Раздел', prop: 'section'},
    
        {
          title: 'Группа',
          prop: 'sectionGroup'
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
              console.log();
            }}
            // onDelete={(val) => dispatch(deleteTesting({ testingId: val?.id }))}
            onDelete={(val) => console.log()}
          />
          {activeModal === 'modal-knowledgeBase' && <ModalArticle />}
          {/* {(createTestingLoading || deleteTestingLoading || updateTestingLoading) && <Loading overlay />} */}
        </div>
      );
    return element;
}

export default AdminKnowledgeBasePage;