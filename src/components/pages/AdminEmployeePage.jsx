import React, { useEffect, useState } from 'react';
import Table from '../Table';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';
import { resetCreateEmployee, resetGetEmployees } from '../../redux/slices/employee.slice';
import { setActiveModal } from '../../redux/slices/app.slice';
import Loading from '../Loading';
import ModalEmployee from '../modals/ModalEmployee';
import { getEmployees } from '../../redux/actions/employee/getEmployees.action';
import { getEmployee } from '../../redux/actions/employee/getEmployee.action';
import { formatPhone } from '../../utils/formatPhone';
import { deleteEmployee } from '../../redux/actions/employee/deleteEmployee.action';
import { sync1C } from '../../redux/actions/employee/sync1C.action';
const AdminEmployeePage = () => {
  const [employeeSuccess, setEmployeeSuccess] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [paramsData, setParamsData] = useState({ page: 1, search: '' });
  const dispatch = useDispatch();
  const { activeModal } = useSelector((state) => state.app);
  const {
    getEmployees: { data: employees, loading, error, pages },
    updateEmployee: { data: updateEmployeeData, loading: updateEmployeeLoading },
    deleteEmployee: { data: deleteEmployeeData, loading: deleteEmployeeLoading },
    sync1C: { data: syncData, loading: syncLoading },
    // createEmployee: { data: createEmployeeData, loading: createEmployeeLoading },
  } = useSelector((state) => state.employee);

  useEffect(() => {
    dispatch(getEmployees(paramsData));
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
    };
  }, []);
  useEffect(() => {
    if (updateEmployeeData) {
      setEmployeeSuccess(true);
      //   dispatch(resetCreateEmployee());
      setTimeout(() => {
        setEmployeeSuccess(false);
      }, 2000);
      setParamsData({ page: 1, search: '' });
    }
  }, [updateEmployeeData]);
  useEffect(() => {
    if (deleteEmployeeData) {
      setParamsData({ page: 1, search: '' });
    }
  }, [deleteEmployeeData]);

  const header = [
    {
      title: 'Активность',
      prop: 'active',
      onChange: (val) => {
        return val == 0 ? <div style={{ color: 'red' }}>Не активная</div> : <div style={{ color: 'green' }}> Активная</div>;
      },
    },
    {
      title: 'ID',
      prop: 'idService',
      onChange: (val) => {
        return val.substring(0, 8);
      },
    },
    {
      title: 'Сотрудник',
      onChange: (val) => {
        return ` ${val?.firstName} ${val?.lastName}`;
      },
    },
    {
      title: 'Телефон',
      prop: 'tel',
      onChange: (val) => {
        return formatPhone(val);
      },
    },

    {
      title: 'Должность',
      prop: 'post',
    },
  ];
  useEffect(() => {
    if (syncData) {
      setParamsData({ page: 1, search: '' });
    }
  }, [syncData]);

  return (
    <div>
      <Table
        pages={pages}
        loading={loading}
        header={header}
        data={viewData}
        onMore={() => setParamsData({ page: paramsData?.page + 1, search: paramsData?.search })}
        onAdd={() => dispatch(sync1C())}
        addBtnText="Загрузить из 1С"
        btnRed
        subText={employeeSuccess && 'Новость добавлена'}
        onSearch={(term) => setParamsData({ page: 1, search: term })}
        onEdit={(val) => {
          dispatch(getEmployee({ id: val?.id }));
          dispatch(setActiveModal('modal-employee'));
        }}
        onDelete={(val) => dispatch(deleteEmployee({ employeeId: val?.id }))}
      />
      {activeModal === 'modal-employee' && <ModalEmployee />}
      {(updateEmployeeLoading || deleteEmployeeLoading || syncLoading) && <Loading overlay />}
    </div>
  );
};

export default AdminEmployeePage;
