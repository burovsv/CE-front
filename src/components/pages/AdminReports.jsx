import React, { useEffect, useState } from 'react';
import Table from '../Table';
import { useDispatch, useSelector } from 'react-redux';
import fileDownload from 'js-file-download';
import moment from 'moment';
import { resetCreateEmployee, resetDownloadEmployees, resetGetEmployees } from '../../redux/slices/employee.slice';
import { setActiveModal } from '../../redux/slices/app.slice';
import Loading from '../Loading';
import ModalEmployee from '../modals/ModalEmployee';
import { getEmployees } from '../../redux/actions/employee/getEmployees.action';
import { getEmployee } from '../../redux/actions/employee/getEmployee.action';
import { formatPhone } from '../../utils/formatPhone';
import { deleteEmployee } from '../../redux/actions/employee/deleteEmployee.action';
import { sync1C } from '../../redux/actions/employee/sync1C.action';
import { getSubdivisions } from '../../redux/actions/subdivision/getSubdivisions.action';
import { downloadEmployees } from '../../redux/actions/employee/downloadEmployees.action';
import axios from 'axios';
import { resetGetSubdivisions } from '../../redux/slices/subdivision.slice';
const AdminReportsPage = () => {
  const [employeeSuccess, setEmployeeSuccess] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [viewSubdivisions, setViewSubdivisions] = useState([]);
  const [paramsData, setParamsData] = useState({ page: 1, search: '', subdivision: 0 });
  const dispatch = useDispatch();
  const { activeModal } = useSelector((state) => state.app);
  const {
    getEmployees: { data: employees, loading, error, pages },
    updateEmployee: { data: updateEmployeeData, loading: updateEmployeeLoading },
    deleteEmployee: { data: deleteEmployeeData, loading: deleteEmployeeLoading },
    sync1C: { data: syncData, loading: syncLoading },
    downloadEmployees: { data: downloadData, loading: downloadLoading },
  } = useSelector((state) => state.employee);
  const {
    getSubdivisions: { data: subdivisions, loading: subdivisionsLoading },
  } = useSelector((state) => state.subdivision);
  useEffect(() => {
    dispatch(getEmployees(paramsData));
  }, [paramsData]);
  useEffect(() => {
    if (subdivisions?.length !== 0 && !subdivisionsLoading) {
      let subdivView = [{ label: 'Все подразделения', value: 0 }];
      subdivisions.map((subdiv) => {
        subdivView.push({ value: subdiv?.id, label: subdiv?.name });
      });
      setViewSubdivisions(subdivView);
      console.log(subdivView);
    }
  }, [subdivisions, subdivisionsLoading]);

  useEffect(() => {
    console.log(paramsData?.page);
    if (paramsData?.page == 1) {
      setViewData(employees);
    } else {
      setViewData([...viewData, ...employees]);
    }
  }, [employees]);

  useEffect(() => {
    dispatch(getSubdivisions());
    return () => {
      dispatch(resetGetEmployees());
      dispatch(resetDownloadEmployees());
      dispatch(resetGetSubdivisions());
    };
  }, []);

  const header = [
    {
      title: 'Должность',
      prop: 'post',
    },
    {
      title: 'ФИО',
      onChange: (val) => {
        return ` ${val?.firstName} ${val?.lastName}`;
      },
    },
    {
      title: 'Подразделение',
      prop: 'subdivision',
    },
    {
      title: 'Чем торгует',
      onChange: (val) => {
        return val?.categories?.map((cat) => <div>{cat?.name}</div>);
      },
    },
  ];
  useEffect(() => {
    if (downloadData?.file) {
      axios
        .get(downloadData?.file, {
          responseType: 'blob',
        })
        .then((res) => {
          fileDownload(res.data, downloadData?.fileName);
          dispatch(resetDownloadEmployees());
        });
    }
  }, [downloadData]);

  return (
    <div>
      <Table
        isReport
        list={viewSubdivisions}
        onChangeList={(val) => {
          setParamsData({ page: 1, search: '', subdivision: val });
        }}
        onDownload={() => {
          dispatch(downloadEmployees({ subdivision: paramsData?.subdivision }));
        }}
        pages={pages}
        loading={loading || downloadLoading}
        header={header}
        data={viewData}
        onMore={() => setParamsData({ page: paramsData?.page + 1, search: paramsData?.search, subdivision: paramsData?.subdivision })}
        addBtnText="Загрузить из 1С"
        btnRed
        subText={employeeSuccess && 'Новость добавлена'}
      />
      {activeModal === 'modal-employee' && <ModalEmployee />}
      {(updateEmployeeLoading || deleteEmployeeLoading || syncLoading) && <Loading overlay />}
    </div>
  );
};

export default AdminReportsPage;
