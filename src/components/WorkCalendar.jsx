import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import { Calendar } from 'react-calendar';
import moment from 'moment';
import { getDaysInMonth } from '../utils/getDaysInMouth';
import { randomInt } from '../utils/randomInt';
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
const findDateInCalendar = (date) => {
  const itemDate = moment(date).format('DD.MM.YYYY');
  const findDate = dataCalendar.find((itemCalendar) => moment(itemCalendar?.date).isSame(itemDate));
  return findDate ? findDate : false;
};
console.log(getDaysInMonth(11, 2022));
const WorkCalendar = () => {
  return (
    <div>
      <Calendar
        minDetail="month"
        maxDetail="month"
        defaultView="month"
        className={'work-calendar'}
        tileContent={({ date }) => {
          const currentDay = parseInt(moment(date).format('D').toString());
          const currentDayOfWeek = date.getDay();
          console.log(currentDayOfWeek);
          if (currentDayOfWeek == 6 || currentDayOfWeek == 0) {
            // return 'tile-empty';
          } else if (currentDay == 1 || currentDay == 2 || currentDay == 3) {
            // return 'tile-sick';
          } else if (currentDay == 20 || currentDay == 21) {
            // return 'tile-vacation';
          } else {
            return (
              <div style={{ color: '#000' }}>{`
            
               ${moment().set('hours', randomInt(8, 12)).set('minutes', randomInt(0, 60)).format('HH:mm').toString()} - ${moment().set('hours', randomInt(14, 17)).set('minutes', randomInt(0, 60)).format('HH:mm').toString()}
            
            `}</div>
            );
          }
          //   const findDate = findDateInCalendar(date);
          //   if (findDate) {
          //     if (findDate?.type == 'work') {
          //       return <div style={{ color: '#000' }}>{findDate?.time}</div>;
          //     }
          //   }
        }}
        tileClassName={({ activeStartDate, date, view }) => {
          //   const findDate = findDateInCalendar(date);

          //   if (findDate) {
          //     switch (findDate?.type) {
          //       case 'work':
          //         return 'tile-work';
          //       case 'vacation':
          //         return 'tile-vacation';
          //       case 'sick':
          //         return 'tile-sick';
          //       default:
          //         return 'tile-empty';
          //     }
          //   } else {
          //     return 'tile-empty';
          //   }
          const currentDay = parseInt(moment(date).format('D').toString());
          const currentDayOfWeek = date.getDay();
          if (currentDayOfWeek == 6 || currentDayOfWeek == 0) {
            return 'tile-empty';
          } else if (currentDay == 1 || currentDay == 2 || currentDay == 3) {
            return 'tile-sick';
          } else if (currentDay == 20 || currentDay == 21) {
            return 'tile-vacation';
          } else {
            return 'tile-work';
          }
        }}
      />
    </div>
  );
};

export default WorkCalendar;
