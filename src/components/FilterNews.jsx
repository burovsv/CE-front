import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserNews } from '../redux/actions/news/getUserNews.action';
import { getNewsFiltersUser } from '../redux/actions/newsFilter/getNewsFiltersUser.action';
import { resetGetUserNews } from '../redux/slices/news.slice';
import Filter from './Filter';
import Loading from './Loading';
import NewsCard from './NewsCard';
import StudyCard from './StudyCard';

const FilterNews = ({ type = 1, textNotFound }) => {
  const dispatch = useDispatch();
  const [firstLoad, setFirstLoad] = useState(false);
  const [viewFilters, setViewFilters] = useState();
  const [activeFilter, setActiveFilter] = useState();
  const [viewData, setViewData] = useState(null);
  const [params, setParams] = useState({ page: 1 });
  const {
    getNewsFiltersUser: { data: filters, loading: filtersLoading },
  } = useSelector((state) => state.newsFilter);
  const {
    getUserNews: { data: newsList, loading: newsLoading, count },
  } = useSelector((state) => state.news);
  useEffect(() => {
    dispatch(getNewsFiltersUser({ type: type }));
  }, []);
  useEffect(() => {
    if (filters?.length !== 0 && filters) {
      const filterView = filters?.map((filt) => ({ label: filt?.name, value: filt?.id }));
      if (filterView?.length !== 0) {
        setViewFilters([{ label: 'ВСЕ', value: '0' }, ...filterView, { label: 'АРХИВ', value: '-1' }]);
      } else {
        setViewFilters([]);
      }
      setFirstLoad(true);
    } else {
      setViewFilters([]);
    }
  }, [filters]);
  useEffect(() => {
    if (viewFilters?.length !== 0 && viewFilters) {
      setActiveFilter(viewFilters[0]?.value);
    }
  }, [viewFilters]);
  useEffect(() => {
    if (params?.newsTypeId && params?.page) {
      dispatch(getUserNews(params));
    }
  }, [params]);

  useEffect(() => {
    if (activeFilter) {
      setParams({ newsFilterId: activeFilter, newsTypeId: type, page: 1 });
    }
  }, [activeFilter]);
  useEffect(() => {
    if (params?.page == 1) {
      setViewData(newsList);
    } else {
      setViewData([...viewData, ...newsList]);
    }
  }, [newsList]);
  return viewData !== null || filters !== null ? (
    <div>
      <div style={{ minHeight: '67px' }}> {!filtersLoading ? <Filter list={viewFilters} activeFilter={activeFilter} onClick={(val) => setActiveFilter(val)} /> : <></>}</div>
      <div className={clsx(type == 1 ? 'news' : 'training')}>
        {viewData?.length !== 0 && viewData ? (
          viewData?.map((newsItem) => (type == 1 ? <NewsCard {...newsItem} key={newsItem?.id} /> : <StudyCard {...newsItem} key={newsItem?.id} />))
        ) : (viewData?.length === 0 || filters?.length === 0) && !newsLoading ? (
          <div class="not-found">{textNotFound}</div>
        ) : (
          <></>
        )}
      </div>
      {viewData?.length !== 0 && count > viewData?.length && !newsLoading ? (
        <button className="table__more" style={{ display: 'flex', justifyContent: 'center', margin: '30px auto 50px auto', alignItems: 'center' }} onClick={() => setParams({ ...params, page: params.page + 1 })}>
          Показать еще...
        </button>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <></>
  );
};

export default FilterNews;
