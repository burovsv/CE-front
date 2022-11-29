import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import { Calendar } from 'react-calendar';
import moment from 'moment';
import { getDaysInMonth } from '../utils/getDaysInMouth';
import { randomInt } from '../utils/randomInt';
import { setActiveMonthYear } from '../redux/slices/workCalendar.slice';
import { getWorkCalendarMonth } from '../redux/actions/workCalendar/getWorkCalendarMonth.slice';
import { convertMinsToHrsMins } from './calendarFull/WorkCalendarFullRow';
const dataCalendar = [
  {
    date: moment('10.11.2022'),
    type: 'work',
    time: '18:30-17:00',
  },
  {
    date: moment('01.11.2022'),
    type: 'vacation',
  },
  {
    date: moment('04.11.2022'),
    type: 'sick',
  },
];

const WorkCalendar = () => {
  const {
    activeMonthYear,
    showFullCalendar,
    getWorkCalendarMonth: { data: workCalendarData, loading: workCalendarMonthLoading },
  } = useSelector((state) => state.workCalendar);
  const { activeCalendarSubdivision } = useSelector((state) => state.employeeHistory);
  const dispatch = useDispatch();
  useEffect(() => {
    // if (activeMonthYear && showFullCalendar) {
    if (activeCalendarSubdivision) {
      dispatch(getWorkCalendarMonth({ date: moment(activeMonthYear).format('YYYY-MM-DD').toString(), subdivision: activeCalendarSubdivision?.id }));
    }
    // }
  }, [activeMonthYear, activeCalendarSubdivision]);
  const findDateInCalendar = (date) => {
    const itemDate = moment(date).format('DD.MM.YYYY').toString();

    const findDate = workCalendarData?.workCalendars?.find((itemCalendar) => moment(itemCalendar?.date).format('DD.MM.YYYY').toString() === itemDate);
    return findDate ? findDate : false;
  };
  return (
    <div style={{ position: 'relative', ...(workCalendarMonthLoading && { paddingBottom: '20px' }) }}>
      {workCalendarMonthLoading && (
        <div style={{ position: 'absolute', paddingLeft: '10px', bottom: '-60px', left: '50%', transform: 'translateX(-50%)' }} className="loading-account">
          Идет загрузка...
        </div>
      )}
      <Calendar
        // value={moment(activeMonthYear).toDate()}
        minDetail="month"
        maxDetail="month"
        defaultView="month"
        className={clsx('work-calendar', workCalendarMonthLoading && 'work-calendar-loading')}
        activeStartDate={moment(activeMonthYear).toDate()}
        onActiveStartDateChange={(monthYear) => {
          console.log(monthYear);
          dispatch(setActiveMonthYear(moment(monthYear.activeStartDate).toString()));
        }}
        tileContent={({ date }) => {
          // const currentDay = parseInt(moment(date).format('D').toString());
          // const currentDayOfWeek = date.getDay();
          // if (currentDayOfWeek == 6 || currentDayOfWeek == 0) {
          //   // return 'tile-empty';
          // } else if (currentDay == 1 || currentDay == 2 || currentDay == 3) {
          //   // return 'tile-sick';
          // } else if (currentDay == 20 || currentDay == 21) {
          //   // return 'tile-vacation';
          // } else {
          //   return (
          //     <div style={{ color: '#000' }}>{`

          //      ${moment().set('hours', randomInt(8, 12)).set('minutes', randomInt(0, 60)).format('HH:mm').toString()} - ${moment().set('hours', randomInt(14, 17)).set('minutes', randomInt(0, 60)).format('HH:mm').toString()}

          //   `}</div>
          //   );
          // }
          const findDate = findDateInCalendar(date);
          if (findDate) {
            if (findDate?.type == 'work') {
              return (
                <div style={{ color: '#000', marginTop: '-4px' }}>
                  {`${moment(findDate?.startTime).format('HH:mm').toString()}-${moment(findDate?.endTime).format('HH:mm').toString()}`} <br />
                  <div style={{ marginTop: '5px', color: ' #949494' }}>{convertMinsToHrsMins(moment(findDate?.endTime).set('seconds', 0).diff(moment(findDate?.startTime).set('seconds', 0), 'minutes'))}</div>
                </div>
              );
            } else if (findDate?.type == 'vacation') {
              return <div style={{ color: '#000' }}>ОТП</div>;
            } else if (findDate?.type == 'sick') {
              return <div style={{ color: '#000' }}>БЛН</div>;
            } else if (findDate?.type == 'day-off') {
              return <div style={{ color: '#000' }}>ВЫХ</div>;
            }
          }
        }}
        tileClassName={({ activeStartDate, date, view }) => {
          const findDate = findDateInCalendar(date);

          if (findDate) {
            switch (findDate?.type) {
              case 'work':
                return 'tile-work';
              case 'vacation':
                return 'tile-vacation';
              case 'sick':
                return 'tile-sick';
              case 'day-off':
                return 'tile-day-off';
              default:
                return 'tile-empty';
            }
          } else {
            return 'tile-empty';
          }

          // const currentDay = parseInt(moment(date).format('D').toString());
          // const currentDayOfWeek = date.getDay();
          // if (currentDayOfWeek == 6 || currentDayOfWeek == 0) {
          //   return 'tile-empty';
          // } else if (currentDay == 1 || currentDay == 2 || currentDay == 3) {
          //   return 'tile-sick';
          // } else if (currentDay == 20 || currentDay == 21) {
          //   return 'tile-vacation';
          // } else {
          //   return 'tile-work';
          // }
        }}
      />
    </div>
  );
};

export default WorkCalendar;
