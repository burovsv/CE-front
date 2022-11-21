import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserNews } from '../../redux/actions/news/getUserNews.action';
import { getNewsFiltersUser } from '../../redux/actions/newsFilter/getNewsFiltersUser.action';
import { resetGetUserNews } from '../../redux/slices/news.slice';
import { resetGetNewsFilterUser } from '../../redux/slices/newsFilter.slice';
import Filter from '../Filter';
import FilterNews from '../FilterNews';
import Loading from '../Loading';
import NewsCard from '../NewsCard';

const HomePage = () => {
  //   const dispatch = useDispatch();
  //   const [viewFilters, setViewFilters] = useState();
  //   const [activeFilter, setActiveFilter] = useState();
  //   const {
  //     getNewsFiltersUser: { data: filters, loading: filtersLoading },
  //   } = useSelector((state) => state.newsFilter);
  //   const {
  //     getUserNews: { data: newsList, loading: newsLoading },
  //   } = useSelector((state) => state.news);
  //   useEffect(() => {
  //     dispatch(getNewsFiltersUser({ type: 1 }));
  //   }, []);
  //   useEffect(() => {
  //     if (filters) {
  //       const filterView = filters?.map((filt) => ({ label: filt?.name, value: filt?.id }));
  //       setViewFilters([{ label: 'ВСЕ', value: '0' }, ...filterView]);
  //     }
  //   }, [filters]);
  //   useEffect(() => {
  //     if (viewFilters?.length !== 0 && viewFilters) {
  //       setActiveFilter(viewFilters[0]?.value);
  //     }
  //   }, [viewFilters]);

  //   useEffect(() => {
  //     if (activeFilter) {
  //       dispatch(getUserNews({ newsFilterId: activeFilter, newsTypeId: 1 }));
  //     }
  //   }, [activeFilter]);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetGetNewsFilterUser());
      dispatch(resetGetUserNews());
    };
  }, []);
  return (
    <>
      <FilterNews textNotFound={'Новостей нет'} />
      {/* {!filtersLoading ? <Filter list={viewFilters} activeFilter={activeFilter} onClick={(val) => setActiveFilter(val)} /> : <Loading />}
      {!newsLoading ? <div className="news">{newsList?.length !== 0 && newsList && !newsLoading ? newsList?.map((newsItem) => <NewsCard {...newsItem} />) : <div class="not-found">Новостей нет</div>}</div> : <Loading />} */}
    </>
  );
};

export default HomePage;
