import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import { Calendar } from 'react-calendar';
import OutsideClickHandler from 'react-outside-click-handler';

const CalendarFilter = ({ date, setDate, onClose }) => {
  return (
    <>
      <OutsideClickHandler onOutsideClick={onClose}>
        <Calendar
          className={'calendar-filter'}
          minDetail="month"
          maxDetail="month"
          defaultView="month"
          onChange={() => {}}
          onClickDay={(newDate) => {
            setDate(newDate);
            onClose();
            //   const currentActive = getDateOnCalendar(datee)?.events;
            //   if (currentActive?.length === 0) {
            //     return;
            //   }
            //   if (currentActive?.length == 1) {
            //     navigate(`news/${currentActive[0]}`);
            //   }
            //   if (currentActive?.length > 1) {
            //     dispatch(setActiveCalendarDates({ date: datee, list: currentActive }));
            //     navigate(`news/results`);
            //   }
          }}
          value={date}
          // tileClassName={({ activeStartDate, date, view }) => setClass(date)}
        />
      </OutsideClickHandler>
    </>
  );
};

export default CalendarFilter;
