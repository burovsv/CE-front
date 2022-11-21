import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import moment from 'moment';

import 'moment/locale/ru';
moment.locale('ru');
const CalendarEvent = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div
      className="event"
      onClick={() => {
        navigate(`/news/${data?.id}`);
      }}>
      <div className="event-title">Напоминание</div>
      <div className="event-number">{moment(data?.dateStart).format('DD')}</div>
      <div className="event-text">
        <b>{`${moment(data?.dateStart).format('DD MMMM')}`}&nbsp;</b>
        {`будет событие ${moment(data?.dateStart).format('HH:mm')} на тему `}
        <div>{`"${data?.title}"`}</div>
      </div>
    </div>
  );
};

export default CalendarEvent;
