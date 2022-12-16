import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import moment from 'moment';
import OutsideClickHandler from 'react-outside-click-handler';
import NumberFormat from 'react-number-format';
const WorkCalendarFullItem = ({ onChangeEndTime, onClickMenu = () => {}, onChangeStartTime, item, style = {}, isAccessEdit }) => {
  const {
    getEmployeeUser: { data: dataUser, loading: loadingUser, error: errorUser },
  } = useSelector((state) => state.employee);
  const {
    getEmployeeHistory: { data: employeeHistory },
    activeCalendarSubdivision,
  } = useSelector((state) => state.employeeHistory);

  const [showMenu, setShowMenu] = useState(false);
  const handleContextMenu = (event) => {
    if (isAccessEdit) {
      setShowMenu(!showMenu);
    }
  };
  const onClose = () => {
    setShowMenu(false);
  };

  const onSaveStartTime = (val) => {
    if (isAccessEdit) {
      setEditStartTime(false);
      onChangeStartTime(val.target.value);
    }
  };

  const onSaveEndTime = (val) => {
    if (isAccessEdit) {
      setEditEndTime(false);
      onChangeEndTime(val.target.value);
    }
  };

  const [editStartTime, setEditStartTime] = useState(false);
  const [editEndTime, setEditEndTime] = useState(false);
  return (
    <td onContextMenu={handleContextMenu} className="work-calendar-full-cell-wrap " style={style}>
      <div>
        {item?.type == 'work' ? (
          <div className="work-calendar-full-cell-day-work">
            {editStartTime ? (
              <NumberFormat
                autoFocus="autofocus"
                onBlur={onSaveStartTime}
                style={{ padding: 0, textAlign: 'center', width: '41px', height: '19px', paddingTop: '1px', marginTop: '8px', border: '1px solid #fff', outline: 'none' }}
                format="##:##"
                mask="_"
                value={moment(item?.startTime).format('HH:mm')}
                placeholder={'Начало'}
                autoComplete="off"
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    onSaveStartTime(event);
                  }
                }}
              />
            ) : (
              <div
                onClick={() => {
                  if (isAccessEdit) {
                    setEditStartTime(true);
                  }
                }}>
                {moment(item?.startTime).format('HH:mm')}
              </div>
            )}
            {editEndTime ? (
              <NumberFormat
                autoFocus="autofocus"
                onBlur={onSaveEndTime}
                style={{ padding: 0, textAlign: 'center', width: '41px', height: '19px', paddingTop: '1px', marginTop: '8px', border: '1px solid #fff', outline: 'none' }}
                format="##:##"
                mask="_"
                value={moment(item?.endTime).format('HH:mm')}
                placeholder={'Конец'}
                autoComplete="off"
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    onSaveEndTime(event);
                  }
                }}
              />
            ) : (
              <div
                onClick={() => {
                  if (isAccessEdit) {
                    setEditEndTime(true);
                  }
                }}>
                {moment(item?.endTime).format('HH:mm')}
              </div>
            )}
            <div>{moment.utc(moment(item?.endTime).set('seconds', 0).diff(moment(item?.startTime).set('seconds', 0))).format('H:mm')}</div>
          </div>
        ) : item?.type == 'vacation' ? (
          <div className="work-calendar-full-cell-day-vacation">отп</div>
        ) : item?.type == 'sick' ? (
          <div className="work-calendar-full-cell-day-sick">блн</div>
        ) : item?.type == 'day-off' ? (
          <div className="work-calendar-full-cell-day-off">вых</div>
        ) : item?.type == 'hours' ? (
          <div className="work-calendar-full-cell-day-off">{item?.hours}</div>
        ) : (
          <></>
        )}
        {showMenu && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', border: '1px solid #000', display: 'flex', flexDirection: 'column', width: '100px', userSelect: 'none', cursor: 'pointer', zIndex: '2' }}>
            <OutsideClickHandler onOutsideClick={onClose}>
              <div
                onClick={() => {
                  onClickMenu('');
                  onClose();
                }}
                style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#ffffff' }}>
                Пустой
              </div>
              <div
                onClick={() => {
                  onClickMenu('work');
                  onClose();
                }}
                style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#c9ffcb' }}>
                Рабочий
              </div>
              <div
                onClick={() => {
                  onClickMenu('vacation');
                  onClose();
                }}
                style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#54ccff' }}>
                Отпуск
              </div>
              <div
                onClick={() => {
                  onClickMenu('sick');
                  onClose();
                }}
                style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#ffaa7b' }}>
                Больничный
              </div>
              <div
                onClick={() => {
                  onClickMenu('day-off');
                  onClose();
                }}
                style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#ffffff' }}>
                Выходной
              </div>
            </OutsideClickHandler>
          </div>
        )}
      </div>
    </td>
  );
};

export default WorkCalendarFullItem;
