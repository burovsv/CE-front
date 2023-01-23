import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import Modal from './Modal';
const ModalPrePayment = ({ list, onClose, onSave, loading }) => {
  return (
    <Modal
      textSend={'Отменить'}
      textCancel={loading ? 'Загрузка...' : 'Выдать'}
      styleSendBtn={{ backgroundColor: 'red', color: '#fff' }}
      title=""
      onSave={onSave}
      onClose={onClose}
      modalStyle={{
        maxWidth: '600px',
      }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px', marginBottom: '20px', rowGap: '20px' }}>
        {Object.keys(list).map(function (key, index) {
          return (
            <div style={{ display: 'grid', alignItems: 'center', gridTemplateColumns: '1fr 75px', columnGap: '43px' }}>
              <div>{list[key].name}</div>
              <div style={{ width: '75px', height: '35px', border: '1px solid #E6E6E6', padding: '10px 15px' }}>{list[key].sum}</div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default ModalPrePayment;
