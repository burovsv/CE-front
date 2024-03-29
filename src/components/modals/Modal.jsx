import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import { setActiveModal } from '../../redux/slices/app.slice';
const Modal = ({ styleSendBtn = {}, titleCenter, children, onSave, onClose, title, disabled, textSend, textCancel, modalStyle = {}, isThanks, styleFooter = {}, styleCloseBtn = {} }) => {
  const dispatch = useDispatch();
  return (
    <>
      <div className="overlay-modal">
        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ ...modalStyle }}>
          {!isThanks && (
            <div
              className="modal__title"
              style={{
                ...(titleCenter && {
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '12px',
                }),
              }}>
              {title}
            </div>
          )}

          <div className="modal__body">{children}</div>
          {!isThanks && (
            <div className="modal__footer" style={styleFooter}>
              <button className="modal__btn" style={styleSendBtn} disabled={disabled} onClick={onSave}>
                {textSend || 'Сохранить'}
              </button>
              <button
                style={styleCloseBtn}
                className="modal__btn"
                onClick={() => {
                  dispatch(setActiveModal(''));
                  onClose?.();
                }}
                disabled={disabled}>
                {textCancel || 'Отменить'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
