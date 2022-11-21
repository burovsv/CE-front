import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
const WorkCalendarFullItem = ({ item, style = {} }) => {
  return (
    <td className="work-calendar-full-cell-wrap " style={style}>
      {item?.type == 'work' ? (
        <div className="work-calendar-full-cell-day-work">
          <div>{item?.startTime.format('HH:mm')}</div>
          <div>{item?.endTime.format('HH:mm')}</div>
          <div>12</div>
        </div>
      ) : item?.type == 'vacation' ? (
        <div className="work-calendar-full-cell-day-vacation">отп</div>
      ) : item?.type == 'sick' ? (
        <div className="work-calendar-full-cell-day-sick">блн</div>
      ) : item?.type == 'day-off' ? (
        <div className="work-calendar-full-cell-day-off">вых</div>
      ) : (
        <></>
      )}
    </td>
  );
};

export default WorkCalendarFullItem;
