import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPrePayment } from '../redux/actions/employee/getPrePayment.action';
import { resetGetPrePayment } from '../redux/slices/employee.slice';

// import { getEmployees } from '../../redux/actions/employee/getEmployees.action';
import Table from './Table';

const PrePaymentList = ({ list }) => {
  const [viewData, setViewData] = useState([]);

  const [paramsData, setParamsData] = useState({ page: 1, search: '', subdivision: list[0].value });
  const dispatch = useDispatch();

  const {
    getPrePayment: { data: employees, loading, error, pages },
  } = useSelector((state) => state.employee);
  const {
    getSubdivisions: { data: subdivisions, loading: subdivisionsLoading },
  } = useSelector((state) => state.subdivision);
  useEffect(() => {
    dispatch(getPrePayment(paramsData));
  }, [paramsData]);

  useEffect(() => {
    console.log(paramsData?.page);
    if (paramsData?.page == 1) {
      setViewData(employees);
    } else {
      setViewData([...viewData, ...employees]);
    }
  }, [employees]);

  useEffect(() => {
    return () => {
      //   dispatch(resetGetEmployees());
      //   dispatch(resetDownloadEmployees());
      //   dispatch(resetGetSubdivisions());
    };
  }, []);

  const header = [
    {
      title: 'Дата',
      onChange: (val) => {
        return moment(val.prePaymentEmployee.date).format('DD.MM.YYYY');
      },
    },
    {
      title: 'Сотрудник',
      onChange: (val) => {
        return ` ${val?.firstName} ${val?.lastName}`;
      },
    },
    {
      title: 'Аванс',
      onChange: (val) => {
        return val.prePaymentEmployee.sum;
      },
    },
  ];
  useEffect(() => {
    return () => {
      dispatch(resetGetPrePayment());
    };
  }, []);

  return (
    <div>
      <Table
        isReport
        list={list}
        onChangeList={(val) => {
          setParamsData({ page: 1, search: '', subdivision: val });
        }}
        onSearch={(term) => setParamsData({ page: 1, search: term, subdivision: paramsData?.subdivision })}
        pages={pages}
        loading={loading}
        header={header}
        data={viewData}
        onMore={() => setParamsData({ page: paramsData?.page + 1, search: paramsData?.search, subdivision: paramsData?.subdivision })}
        addBtnText="Загрузить из 1С"
        btnRed
      />
    </div>
  );
};

export default PrePaymentList;
