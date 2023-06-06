import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import { getStaffList } from '../redux/actions/employee/getStaffList.action';
import { getStaffListBySubdivision } from '../redux/actions/employee/getStaffListBySubdivision.action';
import ModalStaff from './modals/ModalStaff';
import AcceptedCheckbox from './AcceptedCheckbox';
import { setActiveCalendarSubdivision } from '../redux/slices/employeeHistory.slice';
const AcceptedList = ({ onClick }) => {
  const dispatch = useDispatch();
  const {
    getStaffList: { loading, data, error },
    getStaffListBySubdivision: { data: staffBySubdivision },
    getEmployeeUser: { data: dataUser, loading: loadingUser, error: errorUser },
  } = useSelector((state) => state.employee);
  const {
    getEmployeeHistory: { data: employeeHistory },
  } = useSelector((state) => state.employeeHistory);
  const {
    getAcceptWorkTable: { data: acceptWorkTableData, loading: acceptWorkTableLoading },
  } = useSelector((state) => state.workCalendar);
  return (
    <>
      {!acceptWorkTableLoading && (
        <table>
          <tr class="table-plan-head">
            <th>Подразделение</th>
            <th style={{ textAlign: 'center' }}>Комментарий</th>
            <th style={{ textAlign: 'center' }}>Время</th>
            <th style={{ textAlign: 'center' }}>Согласован</th>
          </tr>
          {employeeHistory.map((value) => {
            const findExistAcceptWorkTable = acceptWorkTableData?.find((acceptItem) => acceptItem?.subdivisionId == value?.id);
            return (
              <tr style={{ cursor: 'pointer' }} class={`table-plan-row`}>
                <td
                  onClick={() => {
                    if (value.id) {
                      const findCurrentSubdiv = employeeHistory?.find((historyItem) => historyItem?.id == value.id);
                      const findAccessSubdiv = dataUser?.subdivisions?.find((accessSubdiv) => accessSubdiv?.id == value.id);
                      if (findCurrentSubdiv) {
                        dispatch(setActiveCalendarSubdivision(findCurrentSubdiv));
                      } else if (findAccessSubdiv) {
                        dispatch(setActiveCalendarSubdivision({ id: findAccessSubdiv?.id, name: findAccessSubdiv?.name }));
                      }
                      setTimeout(() => {
                        onClick();
                      }, 300);
                    }
                  }}>
                  {value?.name}
                </td>
                <td></td>
                <td></td>
                <td>
                  <AcceptedCheckbox defaultChecked={findExistAcceptWorkTable ? !!findExistAcceptWorkTable?.accept : false} />
                </td>
              </tr>
            );
          })}
          {[...dataUser?.subdivisions]
            ?.sort((a, b) => a.name.localeCompare(b.name))
            ?.map((itemSubdiv) => {
              const findRepeat = employeeHistory?.find((emplHist) => emplHist.id == itemSubdiv?.id);
              if (!findRepeat) {
                return (
                  <tr style={{ cursor: 'pointer' }} class={`table-plan-row`}>
                    <td
                      onClick={() => {
                        if (itemSubdiv?.id) {
                          const findCurrentSubdiv = employeeHistory?.find((historyItem) => historyItem?.id == itemSubdiv?.id);
                          const findAccessSubdiv = dataUser?.subdivisions?.find((accessSubdiv) => accessSubdiv?.id == itemSubdiv?.id);
                          if (findCurrentSubdiv) {
                            dispatch(setActiveCalendarSubdivision(findCurrentSubdiv));
                          } else if (findAccessSubdiv) {
                            dispatch(setActiveCalendarSubdivision({ id: findAccessSubdiv?.id, name: findAccessSubdiv?.name }));
                          }
                          setTimeout(() => {
                            onClick();
                          }, 300);
                        }
                      }}>
                      {itemSubdiv?.name}
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                      <AcceptedCheckbox />
                    </td>
                  </tr>
                );
              }
            })}
        </table>
      )}

      {staffBySubdivision && <ModalStaff />}
    </>
  );
};

export default AcceptedList;
