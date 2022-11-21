import React, { useEffect, useState } from 'react';
import Table from '../Table';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminNews } from '../../redux/actions/news/getAdminNews.action';
import moment from 'moment';
import { resetCreateNews, resetGetAdminNews, resetUpdateNews } from '../../redux/slices/news.slice';
import ModalNews from '../modals/ModalNews';
import { setActiveModal } from '../../redux/slices/app.slice';
import Loading from '../Loading';
import { getAdminNewsSingle } from '../../redux/actions/news/getAdminNewsSingle.action';
import { deleteNews } from '../../redux/actions/news/deleteNews.action';
import { useSearchParams } from 'react-router-dom';
const AdminNewsPage = () => {
  const [newsSuccess, setNewsSuccess] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [paramsData, setParamsData] = useState({ page: 1, search: '' });
  const dispatch = useDispatch();
  const { activeModal } = useSelector((state) => state.app);
  const [searchParams] = useSearchParams();
  const {
    getAdminNews: { data: news, loading, error, count },
    createNews: { data: createNewsData, loading: createNewsLoading },
    updateNews: { data: updateNewsData, loading: updateNewsLoading },
    deleteNews: { data: deleteNewsData, loading: deleteNewsLoading },
  } = useSelector((state) => state.news);

  useEffect(() => {
    if (paramsData?.type) dispatch(getAdminNews(paramsData));
  }, [paramsData]);

  useEffect(() => {
    if (paramsData?.page == 1) {
      setViewData(news);
    } else {
      setViewData([...viewData, ...news]);
    }
  }, [news]);
  useEffect(() => {
    if (searchParams.get('study') === 'true') {
      setParamsData({ page: 1, search: '', type: 2 });
    } else {
      setParamsData({ page: 1, search: '', type: 1 });
    }
  }, [searchParams]);

  useEffect(() => {
    return () => {
      dispatch(resetGetAdminNews());
    };
  }, []);
  useEffect(() => {
    if (createNewsData) {
      setNewsSuccess(true);
      dispatch(resetCreateNews());
      setTimeout(() => {
        setNewsSuccess(false);
      }, 2000);
      if (searchParams.get('study') === 'true') {
        setParamsData({ page: 1, search: '', type: 2 });
      } else {
        setParamsData({ page: 1, search: '', type: 1 });
      }
    }
  }, [createNewsData]);
  useEffect(() => {
    if (updateNewsData) {
      setNewsSuccess(true);
      dispatch(resetUpdateNews());
      setTimeout(() => {
        setNewsSuccess(false);
      }, 2000);
      if (searchParams.get('study') === 'true') {
        setParamsData({ page: 1, search: '', type: 2 });
      } else {
        setParamsData({ page: 1, search: '', type: 1 });
      }
    }
  }, [updateNewsData]);
  useEffect(() => {
    if (deleteNewsData) {
      if (searchParams.get('study') === 'true') {
        setParamsData({ page: 1, search: '', type: 2 });
      } else {
        setParamsData({ page: 1, search: '', type: 1 });
      }
    }
  }, [deleteNewsData]);

  const header = [
    {
      title: 'Активность',
      prop: 'active',
      onChange: (val) => {
        return val == 0 ? <div style={{ color: 'red' }}>Не активная</div> : <div style={{ color: 'green' }}> Активная</div>;
      },
    },
    {
      title: 'Дата',
      prop: 'dateStart',
      onChange: (val) => {
        return moment(val).format('DD.MM.YYYY');
      },
    },

    {
      title: 'Окончание',
      prop: 'dateEnd',
      onChange: (val) => {
        return moment(val).format('DD.MM.YYYY');
      },
    },
    { title: 'Заголовок', prop: 'title', order: 2 },
    {
      title: 'Тип',
      prop: 'newsFilter',
      onChange: (val) => {
        return val?.name;
      },
    },
  ];

  return (
    <div>
      <Table
        pages={count}
        loading={loading}
        header={header}
        data={viewData}
        onMore={() => setParamsData({ ...paramsData, page: paramsData?.page + 1 })}
        onAdd={() => dispatch(setActiveModal('modal-news'))}
        addBtnText="Добавить"
        subText={newsSuccess && 'Новость добавлена'}
        onSearch={(term) => setParamsData({ ...paramsData, search: term })}
        onEdit={(val) => {
          dispatch(getAdminNewsSingle({ newsId: val?.id }));
          dispatch(setActiveModal('modal-news'));
        }}
        onDelete={(val) => {
          dispatch(deleteNews({ newsId: val?.id }));
        }}
      />
      {activeModal === 'modal-news' && <ModalNews />}
      {(createNewsLoading || updateNewsLoading || deleteNewsLoading) && <Loading overlay />}
    </div>
  );
};

export default AdminNewsPage;
