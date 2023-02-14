import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import moment from 'moment';
import OutsideClickHandler from 'react-outside-click-handler';
import NumberFormat from 'react-number-format';
const WorkCalendarFullItem = ({ onChangeEndTime, onClickMenu = () => {}, onChangeStartTime, item, style = {}, isAccessEdit, timeTableItem, onMouseDown, onMouseUp, onMouseMove, className = '', resetSelection, selectedColumn, lastRowIndex, rowIndex }) => {
  const {
    getEmployeeUser: { data: dataUser, loading: loadingUser, error: errorUser },
  } = useSelector((state) => state.employee);
  const {
    getEmployeeHistory: { data: employeeHistory },
    activeCalendarSubdivision,
  } = useSelector((state) => state.employeeHistory);
  const { workTimeTemplate } = useSelector((state) => state.subdivision);
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
  const testRef = useRef(null);
  return (
    <td onContextMenu={handleContextMenu} className={clsx('work-calendar-full-cell-wrap', className)} style={style} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
      <OutsideClickHandler
        onOutsideClick={() => {
          // resetSelection();
        }}>
        {item?.type == 'work' ? (
          <div className={`work-calendar-full-cell-day-work ${parseInt(moment.utc(moment(item?.endTime).set('seconds', 0).diff(moment(item?.startTime).set('seconds', 0))).format('H')) !== parseInt(timeTableItem?.hours) && timeTableItem?.hours ? 'error' : ''}`}>
            {editStartTime ? (
              <div>
                <NumberFormat
                  ref={testRef}
                  autoFocus="autofocus"
                  onBlur={(ev) => {
                    onSaveStartTime(ev);
                  }}
                  style={{ padding: 0, textAlign: 'center', width: '25.5px', height: '12px', paddingTop: '1px', marginTop: '0px', border: 'none', outline: 'none', fontSize: '10px', paddingBottom: '1px' }}
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
              </div>
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
              <div>
                <NumberFormat
                  autoFocus="autofocus"
                  onBlur={onSaveEndTime}
                  style={{ padding: 0, textAlign: 'center', width: '25px', height: '12px', paddingTop: '1px', marginTop: '0px', border: 'none', outline: 'none', fontSize: '10px', paddingBottom: '1px' }}
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
              </div>
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
            <div>{moment.utc(moment(item?.endTime).set('seconds', 0).diff(moment(item?.startTime).set('seconds', 0))).format('H')}</div>
            <div></div>
            {timeTableItem?.hours ? <div class="work-calendar-full-cell-timetable">{timeTableItem?.hours}</div> : ''}
          </div>
        ) : item?.type == 'vacation' ? (
          <div className="work-calendar-full-cell-day-vacation">отп {timeTableItem?.hours ? <div class="work-calendar-full-cell-timetable">{timeTableItem?.hours}</div> : ''}</div>
        ) : item?.type == 'sick' ? (
          <div className="work-calendar-full-cell-day-sick">блн {timeTableItem?.hours ? <div class="work-calendar-full-cell-timetable">{timeTableItem?.hours}</div> : ''}</div>
        ) : item?.type == 'day-off' ? (
          <div className="work-calendar-full-cell-day-off">вых {timeTableItem?.hours ? <div class="work-calendar-full-cell-timetable">{timeTableItem?.hours}</div> : ''}</div>
        ) : item?.type == 'hours' ? (
          <div className="work-calendar-full-cell-day-off">{timeTableItem?.hours ? <div class="work-calendar-full-cell-timetable">{timeTableItem?.hours}</div> : ''}</div>
        ) : item?.type == 'comand' ? (
          <div className="work-calendar-full-cell-comand">кмд{timeTableItem?.hours ? <div class="work-calendar-full-cell-timetable">{timeTableItem?.hours}</div> : ''}</div>
        ) : (
          <> {timeTableItem?.hours ? <div class="work-calendar-full-cell-timetable">{timeTableItem?.hours}</div> : ''}</>
        )}
        {showMenu && (
          <div
            style={{
              position: 'absolute',
              top: rowIndex == lastRowIndex - 1 ? '-400%' : rowIndex == lastRowIndex - 2 ? '-300%' : rowIndex == lastRowIndex - 3 ? '-200%' : rowIndex == lastRowIndex - 4 ? '-100%' : '50%',
              left: '50%',
              border: '1px solid #000',
              display: 'flex',
              flexDirection: 'column',
              width: '100px',
              userSelect: 'none',
              cursor: 'pointer',
              zIndex: '2',
            }}>
            <OutsideClickHandler
              onOutsideClick={() => {
                console.log('show');
                if (showMenu) {
                  resetSelection();
                }
                //
                onClose();
              }}>
              <div
                onClick={() => {
                  onClickMenu('');
                  onClose();
                }}
                style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#ffffff' }}>
                Пустой
              </div>
              {/* <div
                onClick={() => {
                  onClickMenu('work');
                  onClose();
                }}
                style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#c9ffcb' }}>
                Рабочий
              </div> */}
              {workTimeTemplate?.active1 && (
                <div
                  onClick={() => {
                    onClickMenu('work-1');
                    onClose();
                  }}
                  style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#c9ffcb' }}>
                  Смена 1
                </div>
              )}
              {workTimeTemplate?.active2 && (
                <div
                  onClick={() => {
                    onClickMenu('work-2');
                    onClose();
                  }}
                  style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#c9ffcb' }}>
                  Смена 2
                </div>
              )}
              {workTimeTemplate?.active3 && (
                <div
                  onClick={() => {
                    onClickMenu('work-3');
                    onClose();
                  }}
                  style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#c9ffcb' }}>
                  Смена 3
                </div>
              )}
              {workTimeTemplate?.active4 && (
                <div
                  onClick={() => {
                    onClickMenu('work-4');
                    onClose();
                  }}
                  style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#c9ffcb' }}>
                  Смена магазина
                </div>
              )}

              <div
                onClick={() => {
                  onClickMenu('vacation');
                  onClose();
                }}
                style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#fdec31' }}>
                Отпуск
              </div>
              <div
                onClick={() => {
                  onClickMenu('sick');
                  onClose();
                }}
                style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#54ccff' }}>
                Больничный
              </div>
              <div
                onClick={() => {
                  onClickMenu('comand');
                  onClose();
                }}
                style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#BF40BF' }}>
                Командировка
              </div>
              <div
                onClick={() => {
                  onClickMenu('day-off');
                  onClose();
                }}
                style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#e4e4e4' }}>
                Выходной
              </div>
            </OutsideClickHandler>
          </div>
        )}
      </OutsideClickHandler>
    </td>
  );
};

export default WorkCalendarFullItem;
