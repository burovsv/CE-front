import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import { getStaffList } from '../redux/actions/employee/getStaffList.action';
import { getStaffListBySubdivision } from '../redux/actions/employee/getStaffListBySubdivision.action';
import ModalStaff from './modals/ModalStaff';
import AcceptedCheckbox from './AcceptedCheckbox';
import { setActiveCalendarSubdivision } from '../redux/slices/employeeHistory.slice';
import { resetSwitchAcceptWorkTable } from '../redux/slices/workCalendar.slice';
import moment from 'moment';
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
    activeMonthYear,
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
                      dispatch(resetSwitchAcceptWorkTable());
                      dispatch(
                        getAcceptWorkTableSingle({
                          date: moment(activeMonthYear).format('YYYY-MM-DD').toString(),
                          subdivisionId: value.id,
                        }),
                      );
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
                <td>
                  <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{findExistAcceptWorkTable?.managerComment && `${findExistAcceptWorkTable?.managerComment}`}</div>
                </td>
                <td>{findExistAcceptWorkTable && moment(findExistAcceptWorkTable?.updateAt).format('DD.MM.YYYY в HH:mm').toString()}</td>
                <td>
                  <AcceptedCheckbox subdivisionId={value.id} defaultChecked={findExistAcceptWorkTable ? (findExistAcceptWorkTable?.status == 'accept' ? true : false) : false} />
                </td>
              </tr>
            );
          })}
          {[...dataUser?.subdivisions]
            ?.sort((a, b) => a.name.localeCompare(b.name))
            ?.map((itemSubdiv) => {
              const findExistAcceptWorkTable = acceptWorkTableData?.find((acceptItem) => acceptItem?.subdivisionId == itemSubdiv?.id);
              const findRepeat = employeeHistory?.find((emplHist) => emplHist.id == itemSubdiv?.id);
              if (!findRepeat) {
                return (
                  <tr style={{ cursor: 'pointer' }} class={`table-plan-row`}>
                    <td
                      onClick={() => {
                        if (itemSubdiv?.id) {
                          dispatch(resetSwitchAcceptWorkTable());
                          dispatch(
                            getAcceptWorkTableSingle({
                              date: moment(activeMonthYear).format('YYYY-MM-DD').toString(),
                              subdivisionId: itemSubdiv?.id,
                            }),
                          );
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
                      <AcceptedCheckbox subdivisionId={itemSubdiv?.id} defaultChecked={findExistAcceptWorkTable ? (findExistAcceptWorkTable?.status == 'accept' ? true : false) : false} />
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
