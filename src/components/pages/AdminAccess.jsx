import React, { useEffect, useState } from 'react';
import Table from '../Table';
import { useDispatch, useSelector } from 'react-redux';
import fileDownload from 'js-file-download';
import moment from 'moment';
import { resetCreateEmployee, resetDownloadEmployees, resetGetEmployees, resetUpdateEmployeeAccess } from '../../redux/slices/employee.slice';
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
import { getEmployeeAccess } from '../../redux/actions/employee/getEmployeesAccess.action';
import { updateEmployeeAccess } from '../../redux/actions/employee/updateEmployeesAccess.action';
const AdminAccessPage = () => {
  const [viewAllEmployees, setViewAllEmployees] = useState([]);
  const [employeeAddedAccess, setEmployeeAddedAccess] = useState([]);
  const [employeeRemoveAccess, setEmployeeRemoveAccess] = useState([]);
  const [viewSubdivisions, setViewSubdivisions] = useState([]);
  const [saved, setSaved] = useState(false);
  const [paramsData, setParamsData] = useState({ page: 0, search: '', subdivision: 0 });
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedType, setSelectedType] = useState('content');
  const dispatch = useDispatch();
  const { activeModal } = useSelector((state) => state.app);
  const {
    getEmployees: { data: employees, loading, error, pages },
    getEmployeeAccess: { data: employeesAccess, loading: loadingAccess },
    updateEmployeeAccess: { data: updateEmployee, loading: updateEmployeeLoading },
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
      setSelectedEmployee('');
      subdivisions.map((subdiv) => {
        if (subdiv?.id !== 1) {
          subdivView.push({ value: subdiv?.id, label: subdiv?.name });
        }
      });
      setViewSubdivisions(subdivView);
    }
  }, [subdivisions, subdivisionsLoading]);

  useEffect(() => {
    if (viewAllEmployees?.length == 0 && employees) {
      setViewAllEmployees(employees);
    }
  }, [employees]);
  useEffect(() => {
    if (updateEmployee) {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 3000);
      setEmployeeAddedAccess([]);
      setEmployeeRemoveAccess([]);
      dispatch(resetUpdateEmployeeAccess());
      dispatch(getEmployeeAccess(selectedType));
    }
  }, [updateEmployee]);

  useEffect(() => {
    dispatch(getSubdivisions());
    dispatch(getEmployeeAccess(selectedType));
    return () => {
      dispatch(resetGetEmployees());
      dispatch(resetGetSubdivisions());
    };
  }, []);
  useEffect(() => {
    dispatch(getEmployeeAccess(selectedType));
    setSelectedEmployee('');
    setEmployeeAddedAccess([]);
    setEmployeeRemoveAccess([]);
  }, [selectedType]);

  const handleSave = () => {
    const addedIds = employeeAddedAccess?.map((addedItem) => addedItem?.id);
    const removedIds = employeeRemoveAccess?.map((removedItem) => removedItem?.id);
    dispatch(
      updateEmployeeAccess({
        added: addedIds,
        removed: removedIds,
        type: selectedType,
      }),
    );
  };
  return (
    <div style={{}}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div class="tab">
          <button
            onClick={() => {
              setSelectedType('content');
            }}
            class={`filter__item tablinks ${selectedType === 'content' && 'active'}`}>
            Редактор
          </button>
        </div>{' '}
        <div class="tab">
          <button
            onClick={() => {
              setSelectedType('workTable');
            }}
            class={`filter__item tablinks ${selectedType === 'workTable' && 'active'}`}>
            График
          </button>
        </div>
      </div>
      <div className="modal__select" style={{ width: '300px' }}>
        <select onChange={(val) => setParamsData({ page: 0, search: '', subdivision: val.target.value })} placeholder="Должность" disabled={loading || updateEmployeeLoading}>
          {viewSubdivisions?.map((item) => (
            <option value={item?.value}>{item?.label}</option>
          ))}
        </select>
      </div>{' '}
      <div style={{ display: 'flex', alignItems: 'start' }}>
        <div className="modal__select" style={{ width: '300px' }}>
          <select
            onChange={(val) => {
              if (val.target.value) {
                setSelectedEmployee({ id: val.target.value });
              }
            }}
            value={selectedEmployee?.id || ''}
            placeholder="Должность"
            disabled={loading || updateEmployeeLoading}>
            <option value={''}>{`Выберите сотрудника`}</option>;
            {employees?.map((item, itemIndex) => {
              const findInAccess = employeesAccess?.find((accessItem) => accessItem?.id == item?.id);
              const findInAddedAccess = employeeAddedAccess?.find((accessItem) => accessItem?.id == item?.id);
              const findInRemoveAccess = employeeRemoveAccess?.find((accessItem) => accessItem?.id == item?.id);

              if (((!findInAccess && !findInAddedAccess) || findInRemoveAccess) && item?.id !== 1) {
                return <option value={item?.id}>{`${item?.firstName} ${item?.lastName}`}</option>;
              }
            })}
          </select>
        </div>
        <button
          disabled={updateEmployeeLoading}
          onClick={() => {
            if (selectedEmployee) {
              setEmployeeAddedAccess([...employeeAddedAccess, selectedEmployee]);
            }
          }}
          className="report__btn"
          style={{ height: '48px', marginLeft: '20px' }}>
          Добавить
        </button>
        <button
          disabled={(employeeAddedAccess?.length == 0 && employeeRemoveAccess?.length == 0) || updateEmployeeLoading}
          className="report__btn"
          style={{ height: '48px', marginLeft: '20px' }}
          onClick={() => {
            handleSave();
          }}>
          {updateEmployeeLoading ? (
            <div className="loading-account" style={{ color: '#FF0505' }}>
              &nbsp;Идет загрузка...
            </div>
          ) : saved ? (
            'Сохранено'
          ) : (
            'Сохранить'
          )}
        </button>
      </div>
      <div class="table" style={{ marginTop: '15px', gridTemplateColumns: 'repeat(2, minmax(auto, 1fr)) auto auto' }}>
        <div class="table__head">Подразделение</div>
        <div class="table__head">Ответственный</div>
        <div class="table__head">Должность</div>
        <div class="table__head"></div>
        {viewAllEmployees?.map((employeeItem) => {
          const findInAccess = employeesAccess?.find((accessItem) => accessItem?.id == employeeItem?.id);
          const findInAddedAccess = employeeAddedAccess?.find((accessItem) => accessItem?.id == employeeItem?.id);
          const findInRemoveAccess = employeeRemoveAccess?.find((accessItem) => accessItem?.id == employeeItem?.id);
          if ((findInAccess || findInAddedAccess) && !findInRemoveAccess) {
            return (
              <>
                <div class="table__col">{employeeItem.subdivision}</div>
                <div class="table__col"> {`${employeeItem.firstName} ${employeeItem.lastName}`}</div>
                <div class="table__col">{employeeItem.post}</div>
                <button
                  disabled={updateEmployeeLoading}
                  class="table__col table__icon"
                  onClick={() => {
                    const filterRemoveEmployee = employeeRemoveAccess?.filter((filterRemoveItem) => filterRemoveItem?.id !== employeeItem?.id);
                    const filterAddedEmployee = employeeAddedAccess?.filter((filterRemoveItem) => filterRemoveItem?.id !== employeeItem?.id);
                    setEmployeeAddedAccess(filterAddedEmployee);
                    setEmployeeRemoveAccess([...filterRemoveEmployee, { id: employeeItem?.id }]);
                  }}>
                  <img src="/img/table/delete.svg" />
                </button>
              </>
            );
          }
        })}
      </div>
    </div>
  );
};

export default AdminAccessPage;
