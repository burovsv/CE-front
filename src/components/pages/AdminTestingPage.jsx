import React, { useEffect, useState } from 'react';
import Table from '../Table';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminTesting } from '../../redux/actions/testing/getAdminTesting.action';
import moment from 'moment';
import { resetCreateTesting, resetGetAdminTesting, resetUpdateTesting } from '../../redux/slices/testing.slice';
import { setActiveModal } from '../../redux/slices/app.slice';
import Loading from '../Loading';
import ModalTesting from '../modals/ModalTesting';
import { getAdminTestingSingle } from '../../redux/actions/testing/getAdminTestingSingle.action';
import { deleteTesting } from '../../redux/actions/testing/deleteTesting.action';
const AdminTestingPage = () => {
  const [testingSuccess, setTestingSuccess] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [paramsData, setParamsData] = useState({ page: 1, search: '' });
  const dispatch = useDispatch();
  const { activeModal } = useSelector((state) => state.app);
  const {
    getAdminTesting: { data: testings, loading, error, count: testingCount },
    createTesting: { data: createTestingData, loading: createTestingLoading },
    updateTesting: { data: updateTestingData, loading: updateTestingLoading },
    deleteTesting: { data: deleteTestingData, loading: deleteTestingLoading },
  } = useSelector((state) => state.testing);

  useEffect(() => {
    dispatch(getAdminTesting(paramsData));
  }, [paramsData]);

  useEffect(() => {
    console.log(paramsData?.page);
    if (paramsData?.page == 1) {
      setViewData(testings);
    } else {
      setViewData([...viewData, ...testings]);
    }
  }, [testings]);

  useEffect(() => {
    return () => {
      dispatch(resetGetAdminTesting());
    };
  }, []);
  useEffect(() => {
    if (createTestingData) {
      setTestingSuccess(true);
      setTimeout(() => {
        setTestingSuccess(false);
      }, 2000);
      setParamsData({ page: 1, search: '' });
      dispatch(resetCreateTesting());
    }
  }, [createTestingData]);
  useEffect(() => {
    if (updateTestingData) {
      setTestingSuccess(true);
      setTimeout(() => {
        setTestingSuccess(false);
      }, 2000);
      setParamsData({ page: 1, search: '' });
      dispatch(resetUpdateTesting());
    }
  }, [updateTestingData]);
  useEffect(() => {
    if (deleteTestingData) {
      setParamsData({ page: 1, search: '' });
    }
  }, [deleteTestingData]);

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
    { title: 'Заголовок', prop: 'name', order: 2 },

    {
      title: 'Фильтр',
      onChange: (val) => {
        return val?.categories?.map((cat) => <div>{cat?.name}</div>);
      },
    },
  ];

  return (
    <div>
      <Table
        pages={testingCount}
        loading={loading}
        header={header}
        data={viewData}
        onMore={() => setParamsData({ page: paramsData?.page + 1, search: paramsData?.search })}
        onAdd={() => dispatch(setActiveModal('modal-testing'))}
        addBtnText="Добавить"
        subText={testingSuccess && 'Новость добавлена'}
        onSearch={(term) => setParamsData({ page: 1, search: term })}
        onEdit={(val) => {
          dispatch(setActiveModal('modal-testing'));
          dispatch(getAdminTestingSingle({ id: val?.id }));
        }}
        onDelete={(val) => dispatch(deleteTesting({ testingId: val?.id }))}
      />
      {activeModal === 'modal-testing' && <ModalTesting />}
      {(createTestingLoading || deleteTestingLoading || updateTestingLoading) && <Loading overlay />}
    </div>
  );
};

export default AdminTestingPage;
