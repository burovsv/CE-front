import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import { setActiveModal } from '../../redux/slices/app.slice';
import Modal from './Modal';
const ModalThank = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      dispatch(setActiveModal(''));
    }, 2000);
  }, []);

  return (
    <>
      <Modal
        isThanks
        title="Письмо доверия"
        onSave={() => {}}
        onClose={() => {}}
        modalStyle={{
          padding: '0',
          maxWidth: '360px',
        }}
        titleCenter
        textSend={'Отправить'}
        textCancel={'Назад'}>
        <div className="" style={{ height: '157px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column' }}>
          <div className="" style={{ marginTop: '36px', fontWeight: '600' }}>
            Сообщение отправленно
          </div>
          <img src="/img/success.svg" style={{ display: 'block', marginBottom: '40px' }} />
        </div>
      </Modal>
    </>
  );
};

export default ModalThank;
