import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import NewsCard from '../NewsCard';
import Filter from '../Filter';
import { getCatsByPostAndSubdiv } from '../../redux/actions/category/getCatsByPostAndSubdiv';
import { getUserTesting } from '../../redux/actions/testing/getUserTesting.action';
import TestingCard from '../TestingCard';
import Loading from '../Loading';
import { resetGetUserTesting } from '../../redux/slices/testing.slice';
import { resetGetCatsByPostAndSubdiv } from '../../redux/slices/category.slice';
import { getTestingFiltersUser } from '../../redux/actions/testingFilter/getTestingFiltersUser.action';
import { getTestingFilters } from '../../redux/actions/testingFilter/getTestingFilters.action';
const TestingPage = () => {
  const dispatch = useDispatch();
  const [viewFilters, setViewFilters] = useState();
  const [activeFilter, setActiveFilter] = useState();
  const [viewData, setViewData] = useState([]);
  const [params, setParams] = useState({ page: 1 });
  const [isEmpty, setIsEmpty] = useState(false);
  const {
    getEmployeeUser: { data: user },
  } = useSelector((state) => state.employee);
  const {
    getCatsByPostAndSubdiv: { data: categories, loading: categoriesLoading },
  } = useSelector((state) => state.category);
  const {
    getUserTesting: { data: testingList, loading: testingLoading, count },
  } = useSelector((state) => state.testing);
  const {
    getTestingFiltersUser: { data: testingFilter, loading: testingFilterLoading },
  } = useSelector((state) => state.testingFilter);
  useEffect(() => {
    if (user) {
      dispatch(getTestingFiltersUser());
      dispatch(getCatsByPostAndSubdiv({ subdivisionId: user?.postSubdivision?.subdivisionId, postId: user?.postSubdivision?.postId }));
    }
  }, [user]);
  useEffect(() => {
    if (testingFilter?.length !== 0) {
      const filterView = testingFilter?.map((filt) => ({ label: filt?.name, value: filt?.id }));
      console.log(filterView);
      if (filterView?.length !== 0) setViewFilters([{ label: 'ВСЕ', value: '0' }, ...filterView, { label: 'АРХИВ', value: '-1' }]);
    } else {
      setViewFilters([]);
    }
  }, [testingFilter]);

  useEffect(() => {
    if (activeFilter) {
      setParams({ page: 1, id: activeFilter });
    }
  }, [activeFilter]);

  useEffect(() => {
    if (params?.id !== undefined && params?.page) {
      dispatch(getUserTesting(params));
    }
  }, [params]);
  console.log(viewData?.length);
  useEffect(() => {
    if (viewFilters?.length !== 0 && viewFilters) {
      setActiveFilter(viewFilters[0]?.value);
    }
  }, [viewFilters]);
  useEffect(() => {
    return () => {
      dispatch(resetGetCatsByPostAndSubdiv());
      dispatch(resetGetUserTesting());
    };
  }, []);

  useEffect(() => {
    if (params?.page == 1) {
      setViewData(testingList);
      if (activeFilter == 0 && testingList?.length === 0) {
        setIsEmpty(true);
      }
    } else {
      setViewData([...viewData, ...testingList]);
    }
  }, [testingList]);

  return (
    testingList !== null && (
      <>
        {/* {<div style={{ height: '67px' }}>{!testingFilterLoading && <>{activeFilter == 0 && (viewData?.length === 0 || !viewData) && testingList !== null ? <></> : <Filter list={viewFilters} activeFilter={activeFilter} onClick={(val) => setActiveFilter(val)} />}</>}</div>} */}
        {<div style={{ minHeight: '67px' }}>{<>{(isEmpty && activeFilter == 0 && (viewData?.length === 0 || !viewData)) || testingFilterLoading ? <></> : <Filter list={viewFilters} activeFilter={activeFilter} onClick={(val) => setActiveFilter(val)} />}</>}</div>}

        {viewData?.length !== 0 && viewData ? (
          <div className="news news--testing">{viewData?.length !== 0 ? viewData?.map((testItem) => <TestingCard {...testItem} key={testItem?.id} />) : <div class="not-found">Тестов нет</div>}</div>
        ) : (viewData?.length == 0 || viewFilters?.length === 0) && !testingLoading ? (
          <div class="not-found">Тестов нет</div>
        ) : (
          <></>
        )}
        {viewData?.length !== 0 && count > viewData?.length ? (
          <button className="table__more" style={{ display: 'flex', justifyContent: 'center', margin: '30px auto 50px auto', alignItems: 'center' }} onClick={() => setParams({ ...params, page: params.page + 1 })}>
            Показать еще...
          </button>
        ) : (
          <></>
        )}
      </>
    )
  );
};

export default TestingPage;
