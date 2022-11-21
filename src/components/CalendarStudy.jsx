import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import { Calendar } from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import '../css/calendar-study.css';
import moment from 'moment';
import { resetGetNewsCalendar, setActiveCalendarDates } from '../redux/slices/news.slice';
const CalendarStudy = ({ data }) => {
  const navigate = useNavigate();
  const [value, onChange] = useState(new Date());
  useEffect(() => {
    return () => {
      dispatch(resetGetNewsCalendar());
    };
  }, []);

  const setClass = (date) => {
    //  const dateobj =
    //    this.props.eventsList &&
    //    this.props.eventsList.find((x) => {
    //      return date.getDay() === new Date(x.start).getDay() && date.getMonth() === new Date(x.start).getMonth() && date.getDate() === new Date(x.start).getDate();
    //    });
    const dateActive = getDateOnCalendar(date);

    // var dateToCompare = moment('06/04/2015 18:30:00');
    // var today = moment(new Date());
    // console.log(date.getUTCDate());
    let colorTag = '';
    if (dateActive?.events?.length !== 0) {
      const now = moment(new Date());
      const currentDate = moment(date);
      if (dateActive?.active) {
        colorTag = 'pastDateTag';
      } else {
        colorTag = 'futureDateTag';
      }
    }

    return colorTag;
  };
  function getDateOnCalendar(date) {
    const dateActive = [];
    let isActive = [];
    data?.map((item) => {
      var dateNow = moment(new Date());
      var today = moment(date);
      var dateCurrent = moment(item?.dateStart);
      var dateEnd = moment(item?.dateEnd);
      const isToday = dateCurrent.startOf('day').isSame(today.startOf('day'));

      if (isToday) {
        const isCurrentActive = dateNow.isBefore(dateEnd);
        isActive.push(isCurrentActive);
        dateActive.push(item?.id);
      }
    });
    isActive = isActive?.filter((act) => act);
    return { events: dateActive, active: !!isActive?.length };
  }
  const dispatch = useDispatch();
  return (
    <div style={{ background: '#fff' }}>
      <div className="calendar-title">Мероприятие</div>
      <Calendar
        minDetail="month"
        maxDetail="month"
        defaultView="month"
        onChange={() => {}}
        onClickDay={(datee) => {
          const currentActive = getDateOnCalendar(datee)?.events;
          if (currentActive?.length === 0) {
            return;
          }
          if (currentActive?.length == 1) {
            navigate(`news/${currentActive[0]}`);
          }
          if (currentActive?.length > 1) {
            dispatch(setActiveCalendarDates({ date: datee, list: currentActive }));
            navigate(`news/results`);
          }
        }}
        value={value}
        tileClassName={({ activeStartDate, date, view }) => setClass(date)}
      />
    </div>
  );
};

export default CalendarStudy;
