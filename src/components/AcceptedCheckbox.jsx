import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import { getStaffList } from '../redux/actions/employee/getStaffList.action';
import { getStaffListBySubdivision } from '../redux/actions/employee/getStaffListBySubdivision.action';
import ModalStaff from './modals/ModalStaff';
import { switchAcceptWorkTable } from '../redux/actions/workCalendar/switchAcceptWorkTable.slice';
import moment from 'moment';
const AcceptedCheckbox = ({ subdivisionId, onClick = () => {}, defaultChecked = false }) => {
  const [checked, setChecked] = useState(defaultChecked);
  const dispatch = useDispatch();
  const { activeCalendarSubdivision } = useSelector((state) => state.employeeHistory);
  const {
    activeMonthYear,
    getWorkCalendarMonth: { data: workCalendarData, loading: workCalendarMonthLoading },
    showFullCalendar,
  } = useSelector((state) => state.workCalendar);
  return (
    <div
      style={{ margin: '0 auto', background: '#FFFFFF', height: '12px', width: '36px', border: '1px solid #D8CECE' }}
      onClick={(e) => {
        e.stopPropagation();
        let switchChecked = !checked;
        setChecked(switchChecked);
        dispatch(switchAcceptWorkTable({ subdivisionId, date: moment(activeMonthYear).format('YYYY-MM-DD').toString(), status: switchChecked ? 'accept' : '' }));
      }}>
      <div>{!checked ? <div style={{ width: '17px', height: '10px', background: '#FF0000' }}></div> : <div style={{ marginLeft: 'auto', width: '17px', height: '10px', background: '#3F9F04' }}></div>}</div>
    </div>
  );
};

export default AcceptedCheckbox;
