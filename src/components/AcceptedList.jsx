import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import { getStaffList } from '../redux/actions/employee/getStaffList.action';
import { getStaffListBySubdivision } from '../redux/actions/employee/getStaffListBySubdivision.action';
import ModalStaff from './modals/ModalStaff';
import AcceptedCheckbox from './AcceptedCheckbox';
const AcceptedList = () => {
  const dispatch = useDispatch();
  const {
    getStaffList: { loading, data, error },
    getStaffListBySubdivision: { data: staffBySubdivision },
  } = useSelector((state) => state.employee);
  const {
    getEmployeeHistory: { data: employeeHistory },
  } = useSelector((state) => state.employeeHistory);

  return (
    <>
      <table>
        <tr class="table-plan-head">
          <th>Подразделение</th>
          <th>Комментарий</th>
          <th>Время</th>
          <th>Согласован</th>
        </tr>
        {employeeHistory.map((value) => {
          return (
            <tr style={{ cursor: 'pointer' }} class={`table-plan-row`}>
              <td>{value?.name}</td>
              <td></td>
              <td></td>
              <td>
                <AcceptedCheckbox />
              </td>
            </tr>
          );
        })}
      </table>
      {staffBySubdivision && <ModalStaff />}
    </>
  );
};

export default AcceptedList;
