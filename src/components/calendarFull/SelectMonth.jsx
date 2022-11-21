import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
const SelectMonth = ({ onNextMonth, onPrevMonth, currentMonth }) => {
  return (
    <div className="work-calendar-full-select">
      <button onClick={onPrevMonth} className="work-calendar-full-select-prev"></button>
      <div className="work-calendar-full-select-name">{moment(currentMonth).format('MMMM YYYY').toString()}</div>
      <button onClick={onNextMonth} className="work-calendar-full-select-next"></button>
    </div>
  );
};

export default SelectMonth;
