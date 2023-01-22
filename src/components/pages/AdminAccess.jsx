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
    if (((selectedType === 'workTable' || selectedType === 'balance') && paramsData.subdivision == 0) || selectedType == 'content') {
      dispatch(getEmployees(paramsData));
    }
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
    // dispatch(getEmployeeAccess(selectedType));
    return () => {
      dispatch(resetGetEmployees());
      dispatch(resetGetSubdivisions());
    };
  }, []);
  useEffect(() => {
    setParamsData({ page: 0, search: '', subdivision: 0 });

    dispatch(getEmployeeAccess(selectedType));
    setSelectedEmployee('');
    setEmployeeAddedAccess([]);
    setEmployeeRemoveAccess([]);
  }, [selectedType]);

  const handleSave = () => {
    const employeeAddedWithoutDeleted = employeeAddedAccess?.filter((itemAccess) => !employeeRemoveAccess?.find((itemRemove) => itemRemove?.id == itemAccess?.id && itemRemove?.subdivision == itemAccess?.subdivision));
    dispatch(
      updateEmployeeAccess({
        added: employeeAddedWithoutDeleted,
        removed: employeeRemoveAccess,
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
        <div class="tab">
          <button
            onClick={() => {
              setSelectedType('balance');
            }}
            class={`filter__item tablinks ${selectedType === 'balance' && 'active'}`}>
            Управляющий
          </button>
        </div>
      </div>
      <div className="modal__select" style={{ width: '300px' }}>
        <select
          onChange={(val) => {
            setParamsData({ page: 0, search: '', subdivision: val.target.value });
          }}
          value={paramsData?.subdivision}
          placeholder="Должность"
          disabled={loading || updateEmployeeLoading}>
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
              let findInAccess = false;
              let findInAddedAccess = false;
              let findInRemoveAccess = true;
              if (selectedType == 'content') {
                findInAccess = employeesAccess?.find((accessItem) => accessItem?.id == item?.id);
                findInAddedAccess = employeeAddedAccess?.find((accessItem) => accessItem?.id == item?.id);
                findInRemoveAccess = employeeRemoveAccess?.find((accessItem) => accessItem?.id == item?.id);
              } else {
              }

              if (((!findInAccess && !findInAddedAccess) || findInRemoveAccess) && item?.id !== 1) {
                return <option value={item?.id}>{`${item?.firstName} ${item?.lastName}`}</option>;
              }
            })}
          </select>
        </div>
        <button
          disabled={updateEmployeeLoading || (selectedType == 'workTable' || selectedType == 'balance' ? !selectedEmployee || !paramsData.subdivision : !selectedEmployee)}
          onClick={() => {
            if (selectedEmployee?.id) {
              const findExist = [...employeesAccess, ...employeeAddedAccess].find((existEmpl) => existEmpl?.id == selectedEmployee?.id && existEmpl.subdivision == paramsData.subdivision);
              const findInRemove = employeeRemoveAccess?.findIndex((filterRemoveItem) => filterRemoveItem?.id == selectedEmployee?.id && filterRemoveItem.subdivision == paramsData.subdivision);

              if (findInRemove !== -1) {
                setEmployeeRemoveAccess([...employeeRemoveAccess.slice(0, findInRemove)]);
              }
              if (!findExist) {
                setEmployeeAddedAccess([...employeeAddedAccess, { id: parseInt(selectedEmployee.id), subdivision: parseInt(paramsData.subdivision) }]);
              } else {
              }
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
        {[...employeesAccess, ...employeeAddedAccess]?.map((employeeItem, indexItem) => {
          let findInAddedAccess;
          const findInAccess = viewAllEmployees?.find((accessItem) => accessItem?.id == employeeItem?.id);
          const findAccessSubdivision = viewSubdivisions?.find((accessSubdiv) => accessSubdiv?.value == employeeItem?.subdivision);
          // findInAddedAccess = employeeAddedAccess?.find((accessItem) => accessItem?.id == employeeItem?.id);

          // findInAddedAccess = employeeAddedAccess?.filter((accessItem) => accessItem?.id == employeeItem?.id);

          const findInRemoveAccess = employeeRemoveAccess?.find((accessItem) => accessItem?.id == employeeItem?.id && accessItem.subdivision == employeeItem?.subdivision);
          console.log(findInAccess && !findInRemoveAccess);
          if (findInAccess && !findInRemoveAccess) {
            return (
              <>
                <div className={`table__col ${indexItem % 2 !== 0 ? 'table-common__cell-odd' : ''}`}>{findAccessSubdivision?.label}</div>
                <div className={`table__col ${indexItem % 2 !== 0 ? 'table-common__cell-odd' : ''}`}> {`${findInAccess.firstName} ${findInAccess.lastName}`}</div>
                <div className={`table__col ${indexItem % 2 !== 0 ? 'table-common__cell-odd' : ''}`}>{findInAccess.post}</div>
                <button
                  disabled={updateEmployeeLoading}
                  className={`table__col table__icon ${indexItem % 2 !== 0 ? 'table-common__cell-odd' : ''}`}
                  onClick={() => {
                    // const filterRemoveEmployee = employeeRemoveAccess?.filter((filterRemoveItem) => filterRemoveItem?.id !== findInAccess?.id && filterRemoveItem?.subdivision !== employeeItem?.subdivision);
                    // const filterAddedEmployee = employeeAddedAccess?.filter((filterRemoveItem) => filterRemoveItem?.id != findInAccess?.id && filterRemoveItem?.subdivision != employeeItem?.subdivision);
                    // setEmployeeAddedAccess(filterAddedEmployee);
                    setEmployeeRemoveAccess([...employeeRemoveAccess, { id: parseInt(findInAccess?.id), subdivision: parseInt(employeeItem?.subdivision) }]);
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
