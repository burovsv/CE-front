import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import Modal from './Modal';
const ModalAcceptTable = ({ onClose, onSave }) => {
  return (
    <Modal
      textSend={'Назад'}
      styleFooter={{ paddingBottom: '0px', paddingLeft: '5px', paddingRight: '5px' }}
      styleCloseBtn={{ background: '#FFA18C' }}
      modalStyle={{ maxWidth: '274px', height: '120px' }}
      textCancel={'Выйти'}
      styleSendBtn={{ background: '#FDEC31' }}
      title=""
      onSave={onClose}
      onClose={onSave}>
      <div style={{ margin: '0 auto', textAlign: 'center', marginBottom: '20px', marginTop: '-25px', fontSize: '12px' }}> Выйти без сохранение ?</div>
    </Modal>
  );
};

export default ModalAcceptTable;
