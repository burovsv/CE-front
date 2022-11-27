import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import Modal from './Modal';
const ModalAcceptTable = ({ onClose, onSave }) => {
  return (
    <Modal textSend={'Выйти'} textCancel={'Назад'} styleSendBtn={{ backgroundColor: 'red', color: '#fff' }} title="" onSave={onSave} onClose={onClose}>
      <div style={{ margin: '0 auto', textAlign: 'center', marginBottom: '30px', fontSize: '18px' }}> Выйти без сохранение ?</div>
    </Modal>
  );
};

export default ModalAcceptTable;
