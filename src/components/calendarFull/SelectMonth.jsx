import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import ModalAcceptTable from '../modals/ModalAcceptTable';
const SelectMonth = ({ onNextMonth, onPrevMonth, currentMonth, isEdited }) => {
  const [showPrevAccept, setShowPrevAccept] = useState(false);
  const [showNextAccept, setShowNextAccept] = useState(false);
  return (
    <>
      <div className="work-calendar-full-select">
        <button
          onClick={() => {
            if (isEdited) {
              setShowPrevAccept(true);
            } else {
              onPrevMonth();
            }
          }}
          className="work-calendar-full-select-prev"></button>
        <div className="work-calendar-full-select-name">{moment(currentMonth).format('MMMM YYYY').toString()}</div>
        <button
          onClick={() => {
            if (isEdited) {
              setShowNextAccept(true);
            } else {
              onNextMonth();
            }
          }}
          className="work-calendar-full-select-next"></button>
      </div>
      {showPrevAccept && (
        <ModalAcceptTable
          onClose={() => {
            setShowPrevAccept(false);
          }}
          onSave={() => {
            setShowPrevAccept(false);
            onPrevMonth();
          }}
        />
      )}
      {showNextAccept && (
        <ModalAcceptTable
          onClose={() => {
            setShowNextAccept(false);
          }}
          onSave={() => {
            setShowNextAccept(false);
            onNextMonth();
          }}
        />
      )}
    </>
  );
};

export default SelectMonth;
