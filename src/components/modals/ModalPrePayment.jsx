import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import Modal from './Modal';
const ModalPrePayment = ({ list, onClose, onSave, loading, setComment, comment }) => {
  return (
    <Modal
      textSend={'Отменить'}
      textCancel={loading ? 'Загрузка...' : 'Выдать'}
      styleSendBtn={{ backgroundColor: 'red', color: '#fff', width: '100px', padding: '10px', marginRight: 'auto', order: 2 }}
      styleCloseBtn={{
        width: '84px',
        marginLeft: 'auto',
      }}
      title=""
      onSave={onSave}
      onClose={onClose}
      modalStyle={{
        maxWidth: Object.keys(list).length == 1 ? '300px' : '600px',
      }}>
      <div style={{ display: 'grid', gridTemplateColumns: Object.keys(list).length == 1 ? '1fr' : '1fr 1fr', columnGap: '20px', marginBottom: '20px', rowGap: '20px' }}>
        {Object.keys(list).map(function (key, index) {
          return (
            <div style={{ display: 'grid', alignItems: 'center', gridTemplateColumns: '1fr 84px', columnGap: '43px' }}>
              <div>{list[key].name}</div>
              <div style={{ width: '84px', height: '35px', border: '1px solid #E6E6E6', padding: '10px 15px' }}>{list[key].sum}</div>
            </div>
          );
        })}
        <input
          defaultValue={''}
          value={comment}
          onChange={(event) => {
            if (event.target.value?.length <= 20) {
              setComment(event.target.value);
            }
          }}
          placeholder="Комментарий ..."
          type="text"
          style={{
            height: '35px',
            width: '100%',
            border: '0.2px solid rgb(230, 230, 230)',
            outline: 'none',
            padding: '10px',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            background: '#fff',
          }}
        />
      </div>
    </Modal>
  );
};

export default ModalPrePayment;
