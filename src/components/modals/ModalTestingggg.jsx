import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import Modal from './Modal';
import { setActiveModal } from '../../redux/slices/app.slice';
const ModalTesting = () => {
  const dispatch = useDispatch();
  return (
    <>
      <Modal title="Добавление тестирование" onSave={() => {}}>
        <input type="text" placeholder="Заголовок новости" />
        <div className="date">
          <div className="date__wrap">
            <div className="date__title">от:</div>
            <input type="text" placeholder="Заголовок новости" />
          </div>
          <div className="date__wrap">
            <div className="date__title">от:</div>
            <input type="text" placeholder="Заголовок новости" />
          </div>
        </div>
        <input type="text" placeholder="Ссылка на тест" />
        <input type="text" placeholder="Подразделение" />
        <input type="text" placeholder="Должность" />
        <select placeholder="Должность">
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
      </Modal>
    </>
  );
};

export default ModalTesting;
