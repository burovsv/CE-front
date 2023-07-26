import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import { getStaffList } from '../redux/actions/employee/getStaffList.action';
import { getStaffListBySubdivision } from '../redux/actions/employee/getStaffListBySubdivision.action';
import ModalStaff from './modals/ModalStaff';
const StaffList = () => {
  const dispatch = useDispatch();
  const {
    getEmployeeUser: { data: dataUser, loading: loadingUser, error: errorUser },
    getStaffList: { loading, data, error },
    getStaffListBySubdivision: { data: staffBySubdivision },
  } = useSelector((state) => state.employee);
  useEffect(() => {
    dispatch(getStaffList());
  }, []);

  return (
    <>
      <table>
        <tr class="table-plan-head">
          <th width="170px">Подразделение</th>
          <th style={{ textAlign: 'left' }}>
            Штатное <br /> расписание
          </th>{' '}
          <th width="100%">Штат факт</th>
        </tr>
        {data?.map((item) => {
          const accessSubdivision = dataUser?.accessBalance?.find((subdivFind) => subdivFind?.subdivisionId == item?.id);
          if (accessSubdivision)
            return (
              <tr
                style={{ cursor: 'pointer' }}
                class={`table-plan-row`}
                onClick={() => {
                  dispatch(getStaffListBySubdivision({ subdivisionId: item?.id }));
                }}>
                <td>{item?.name}</td>
                <td>{item?.staffCount}</td>
                <td>{`${item?.sumStaffCount}/${item?.staffCount}`}</td>
              </tr>
            );
        })}
      </table>
      {staffBySubdivision && <ModalStaff />}
    </>
  );
};

export default StaffList;
