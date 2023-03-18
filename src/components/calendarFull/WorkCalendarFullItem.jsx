import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import moment from 'moment';
import OutsideClickHandler from 'react-outside-click-handler';
import NumberFormat from 'react-number-format';
const WorkCalendarFullItem = ({ onChangeEndTime, onClickMenu = () => {}, onChangeStartTime, item, style = {}, isAccessEdit, timeTableItem, onMouseDown, onMouseUp, onMouseMove, className = '', resetSelection, selectedColumn, lastRowIndex, rowIndex, itemIndex }) => {
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
  // const numberDayOfWeek = item?.getDay();
  console.log(item);
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
          <div className="work-calendar-full-cell-day-vacation" style={{ ...(timeTableItem?.hours && { background: '#1F1F1F', color: '#fff' }) }}>
            отп {timeTableItem?.hours ? <div class="work-calendar-full-cell-timetable">{timeTableItem?.hours}</div> : ''}
          </div>
        ) : item?.type == 'sick' ? (
          <div style={{ ...(timeTableItem?.hours && { background: '#1F1F1F', color: '#fff' }) }} className="work-calendar-full-cell-day-sick">
            блн {timeTableItem?.hours ? <div class="work-calendar-full-cell-timetable">{timeTableItem?.hours}</div> : ''}
          </div>
        ) : item?.type == 'day-off' ? (
          <div style={{ ...(timeTableItem?.hours && { background: '#1F1F1F', color: '#fff' }) }} className="work-calendar-full-cell-day-off">
            вых {timeTableItem?.hours ? <div class="work-calendar-full-cell-timetable">{timeTableItem?.hours}</div> : ''}
          </div>
        ) : item?.type == 'hours' ? (
          <div style={{ ...(timeTableItem?.hours && { background: '#1F1F1F', color: '#fff' }) }} className="work-calendar-full-cell-day-off">
            {timeTableItem?.hours ? <div class="work-calendar-full-cell-timetable">{timeTableItem?.hours}</div> : ''}
          </div>
        ) : item?.type == 'comand' ? (
          <div style={{ ...(timeTableItem?.hours && { background: '#1F1F1F', color: '#fff' }) }} className="work-calendar-full-cell-comand">
            кмд{timeTableItem?.hours ? <div class="work-calendar-full-cell-timetable">{timeTableItem?.hours}</div> : ''}
          </div>
        ) : (
          <> {timeTableItem?.hours ? <div class="work-calendar-full-cell-timetable">{timeTableItem?.hours}</div> : ''}</>
        )}
        {showMenu && (
          <div
            style={{
              position: 'absolute',
              top: lastRowIndex <= 2 ? '-14px' : rowIndex == lastRowIndex - 1 ? '-400%' : rowIndex == lastRowIndex - 2 ? '-300%' : rowIndex == lastRowIndex - 3 ? '-200%' : rowIndex == lastRowIndex - 4 ? '-100%' : '50%',
              left:
                lastRowIndex <= 2 && itemIndex == 23
                  ? 'calc(50% - 70px)'
                  : lastRowIndex <= 2 && itemIndex == 24
                  ? 'calc(50% - 140px)'
                  : lastRowIndex <= 2 && itemIndex == 25
                  ? 'calc(50% - 210px)'
                  : lastRowIndex <= 2 && itemIndex == 26
                  ? 'calc(50% - 280px)'
                  : lastRowIndex <= 2 && itemIndex == 27
                  ? 'calc(50% - 350px)'
                  : lastRowIndex <= 2 && itemIndex == 28
                  ? 'calc(50% - 425px)'
                  : lastRowIndex <= 2 && itemIndex == 29
                  ? 'calc(50% - 500px)'
                  : lastRowIndex <= 2 && itemIndex == 30
                  ? 'calc(50% - 575px)'
                  : '50%',
              border: '1px solid #000',
              display: 'flex',
              flexDirection: lastRowIndex <= 2 ? 'row' : 'column',
              width: lastRowIndex <= 2 ? 'auto' : '100px',
              userSelect: 'none',
              cursor: 'pointer',
              zIndex: '10',
            }}>
            <OutsideClickHandler
              class="hl"
              onOutsideClick={() => {
                console.log('show');
                if (showMenu) {
                  resetSelection();
                }
                //
                onClose();
              }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: lastRowIndex <= 2 ? 'row' : 'column',
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
                    style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#c9ffcb', whiteSpace: 'nowrap' }}>
                    Смена 1
                  </div>
                )}
                {workTimeTemplate?.active2 && (
                  <div
                    onClick={() => {
                      onClickMenu('work-2');
                      onClose();
                    }}
                    style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#c9ffcb', whiteSpace: 'nowrap' }}>
                    Смена 2
                  </div>
                )}
                {workTimeTemplate?.active3 && (
                  <div
                    onClick={() => {
                      onClickMenu('work-3');
                      onClose();
                    }}
                    style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#c9ffcb', whiteSpace: 'nowrap' }}>
                    Смена 3
                  </div>
                )}
                {workTimeTemplate?.active4 && (
                  <div
                    onClick={() => {
                      onClickMenu('work-4');
                      onClose();
                    }}
                    style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#c9ffcb', whiteSpace: 'nowrap' }}>
                    Смена магазина
                  </div>
                )}

                <div
                  onClick={() => {
                    onClickMenu('vacation');
                    onClose();
                  }}
                  style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#FCF6B1' }}>
                  Отпуск
                </div>
                <div
                  onClick={() => {
                    onClickMenu('sick');
                    onClose();
                  }}
                  style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#99E1FF' }}>
                  Больничный
                </div>
                <div
                  onClick={() => {
                    onClickMenu('comand');
                    onClose();
                  }}
                  style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#D0BAFF' }}>
                  Командировка
                </div>
                <div
                  onClick={() => {
                    onClickMenu('day-off');
                    onClose();
                  }}
                  style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#f8bbbb' }}>
                  Выходной
                </div>
              </div>
            </OutsideClickHandler>
          </div>
        )}
      </OutsideClickHandler>
    </td>
  );
};

export default WorkCalendarFullItem;
