import clsx from 'clsx';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import WorkCalendarFullItem from './WorkCalendarFullItem';
import OutsideClickHandler from 'react-outside-click-handler';
import { addEmployeeToHiddenList } from '../../redux/slices/employee.slice';
export const convertMinsToHrsMins = (minutes) => {
  if (minutes) {
    var h = Math.floor(minutes / 60);
    var m = minutes % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return h;
  } else return 0;
};
const WorkCalendarFullRow = ({ dayList, isTimeTable, setIsEdited, item, control, index, isAccessEdit, timeTableRow, selectedColumn, resetSelectedColumn, lastPostRow = false, lastIndex, onLastCountWork, onLastCountWorkLast, onShowList, onShowHiddenList, showHiddenList }) => {
  const {
    getEmployeeUser: { data: dataUser, loading: loadingUser, error: errorUser },
    hiddenEmployeeList,
  } = useSelector((state) => state.employee);
  const {
    getEmployeeHiddenList: { data: getEmployeeHiddenData },
  } = useSelector((state) => state.employeeHidden);
  const { workTimeTemplate } = useSelector((state) => state.subdivision);
  const {
    getEmployeeHistory: { data: employeeHistory },
    activeCalendarSubdivision,
  } = useSelector((state) => state.employeeHistory);
  const { fields, append, update, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: `calendar[${index}].calendarData`,
  });
  const validateTime = (time, date) => {
    if (!time) {
      return false;
    }
    const splitTime = time?.split(':');
    if (!splitTime) {
      return false;
    }
    if (isNaN(parseInt(splitTime[1])) || isNaN(parseInt(splitTime[0]))) {
      return false;
    }
    const dateWithUpdatTime = moment(date).set('hours', splitTime[0]).set('minutes', splitTime[1]);
    if (dateWithUpdatTime.isValid()) {
      return dateWithUpdatTime;
    }
  };

  const { activeMonthYear } = useSelector((state) => state.workCalendar);
  const [start, setStart] = useState(-1);
  const [end, setEnd] = useState(-1);
  const [selecting, setSelecting] = useState(false);

  let beginSelection = (i) => {
    setSelecting(true);
    setStart(i);
    updateSelection(i);
  };

  let endSelection = (i = end) => {
    setSelecting(false);

    updateSelection(i);
  };

  let updateSelection = (i) => {
    if (selecting) {
      setEnd(i);
    }
  };
  const timeTableByDay = (currentDay) => {
    return timeTableRow?.find(
      (timeTableItem) =>
        moment(timeTableItem.date_time).format('YYYY-MM-DD').toString() ==
        moment(activeMonthYear)
          .set('date', currentDay + 1)
          .format('YYYY-MM-DD')
          .toString(),
    );
  };
  const dispatch = useDispatch();
  const [showMenuHidden, setShowMenuHidden] = useState(false);
  return (showHiddenList ? true : !hiddenEmployeeList?.find((hiddenEmployeeItem) => hiddenEmployeeItem == item.userId)) && (
    <>
      {lastPostRow && (
        <tr class="last-post-row">
          <td class="work-calendar-full-cell-small-wrap work-calendar-full-cell-bold" colSpan={2} style={{ position: 'sticky', left: '0px', zIndex: 2, backgroundColor: '#fff' }}>
            Кол-во в смену
          </td>
          {onLastCountWork?.map((itemCount, countIndex) => (
            <td class={clsx('work-calendar-full-cell-no-border work-calendar-full-cell-small-wrap work', dayList[countIndex]?.getDay() === 6 ? 'cell-day-sb' : dayList[countIndex]?.getDay() === 0 ? 'cell-day-vs' : '')}>{itemCount}</td>
          ))}{' '}
          <td class="work-calendar-full-cell-no-border work-calendar-full-cell-small-wrap work sticky-right-td" style={{ position: 'sticky', right: '90px', zIndex: 2, background: '#Fff', width: '30px' }}></td>
          <td class="work-calendar-full-cell-no-border work-calendar-full-cell-small-wrap work" style={{ position: 'sticky', right: '60px', zIndex: 2, background: '#Fff', width: '30px' }}></td>
          <td class="work-calendar-full-cell-no-border work-calendar-full-cell-small-wrap work" style={{ position: 'sticky', right: '30px', zIndex: 2, background: '#Fff', width: '30px' }}></td>
          <td class="work-calendar-full-cell-no-border work-calendar-full-cell-small-wrap work" style={{ position: 'sticky', right: '0px', zIndex: 2, background: '#Fff', width: '30px' }}></td>
        </tr>
      )}
      <tr className={clsx(lastPostRow && 'last-post-row')}>
        <td
          onContextMenu={() => {
            if (isAccessEdit) {
              setShowMenuHidden(true);
            }
          }}
          width="150"
          className="work-calendar-full-cell-wrap "
          style={{ position: 'sticky', left: '0px', zIndex: 100, backgroundColor: '#fff' }}>
          {item?.lastName} <br />
          {item?.firstName}
          {showMenuHidden && !showHiddenList && isAccessEdit && (
            <div
              style={{
                position: 'absolute',
                top: '-100%',
                left: '50%',
                border: '1px solid #000',
                display: 'flex',
                flexDirection: 'column',
                width: '100px',
                userSelect: 'none',
                cursor: 'pointer',
                zIndex: '1000',
              }}>
              <OutsideClickHandler
                class="hl"
                onOutsideClick={() => {
                  setShowMenuHidden(false);
                }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                  <div
                    onClick={() => {
                      dispatch(addEmployeeToHiddenList(item?.userId));
                      setShowMenuHidden(false);
                    }}
                    style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#ffffff' }}>
                    Скрыть
                  </div>{' '}
                  {/* <div
                    onClick={() => {
                      onShowHiddenList();
                      setShowMenuHidden(false);
                    }}
                    style={{ width: '100%', textAlign: 'left', padding: '10px', marginRight: 'auto', background: '#ffffff' }}>
                    Показать
                  </div> */}
                </div>
              </OutsideClickHandler>
            </div>
          )}
        </td>
        <td width="150" className="work-calendar-full-cell-wrap " style={{ position: 'sticky', left: '100px', zIndex: 2, backgroundColor: '#fff' }}>
          {item?.post}
        </td>
        {fields?.map((dayItem, indexItem) => {
          return (
            <WorkCalendarFullItem
              itemIndex={indexItem}
              rowIndex={index}
              lastRowIndex={lastIndex}
              selectedColumn={selectedColumn}
              resetSelection={() => {
                resetSelectedColumn();
                if (!selecting) {
                  setStart(-1);
                  setEnd(-1);
                }
              }}
              className={((end <= indexItem && indexItem <= start) || (start <= indexItem && indexItem <= end) || indexItem == selectedColumn ? 'cell-selected ' : '') + (dayList[indexItem]?.getDay() === 6 ? 'cell-day-sb' : dayList[indexItem]?.getDay() === 0 ? 'cell-day-vs' : '')}
              onMouseDown={(e) => {
                if (e.nativeEvent.button === 2 && isAccessEdit) {
                  resetSelectedColumn();
                  beginSelection(indexItem);
                }
              }}
              onMouseUp={(e) => {
                if (e.nativeEvent.button === 2) {
                  endSelection(indexItem);
                }
              }}
              onMouseMove={() => updateSelection(indexItem)}
              timeTableItem={timeTableByDay(indexItem)}
              isAccessEdit={isAccessEdit}
              onChangeStartTime={(newStartTime) => {
                if (isAccessEdit) {
                  const resultTime = validateTime(newStartTime, dayItem?.startTime);
                  if (resultTime) {
                    const minStartTime = moment(dayItem?.date).set('hours', 8).set('minutes', 0);
                    const currentEndTime = moment(dayItem?.endTime);
                    if (!resultTime.isBefore(minStartTime) && !resultTime.isSameOrAfter(currentEndTime)) {
                      update(indexItem, { ...dayItem, startTime: resultTime.set('seconds', 0).toDate() });
                      setIsEdited(true);
                    }
                  }
                }
              }}
              onChangeEndTime={(newEndTime) => {
                if (isAccessEdit) {
                  const resultTime = validateTime(newEndTime, dayItem?.endTime);
                  if (resultTime) {
                    const minEndTime = moment(dayItem?.date).set('hours', 23).set('minutes', 0);
                    const currentStartTime = moment(dayItem?.startTime);
                    if (!resultTime.isAfter(minEndTime) && !resultTime.isSameOrBefore(currentStartTime)) {
                      update(indexItem, { ...dayItem, endTime: resultTime.set('seconds', 0).toDate() });
                      setIsEdited(true);
                    }
                  }
                }
              }}
              onClickMenu={(type) => {
                if (isAccessEdit) {
                  let startIndex = start;
                  let endIndex = end;
                  if (start > end) {
                    startIndex = end;
                    endIndex = start;
                  }
                  for (let indexCell = startIndex; indexCell <= endIndex; indexCell++) {
                    let updateCell = { type };
                    if (type == 'work-1' || type == 'work-2' || type == 'work-3' || type == 'work-4') {
                      updateCell.type = 'work';
                    }
                    if (type) {
                      if (type === 'work' && (!dayItem?.startTime || !dayItem?.endTime)) {
                        updateCell.startTime = moment(activeMonthYear)
                          .set('date', indexCell + 1)
                          .set('hours', 8)
                          .set('minutes', 0)
                          .set('seconds', 0)
                          .toDate();
                        updateCell.endTime = moment(activeMonthYear)
                          .set('date', indexCell + 1)
                          .set('hours', 23)
                          .set('minutes', 0)
                          .set('seconds', 0)
                          .toDate();
                      } else if (type === 'work-1') {
                        const splitTimeWorkStart = workTimeTemplate?.workTimeStart1?.split(':');

                        const splitTimeWorkEnd = workTimeTemplate?.workTimeEnd1?.split(':');
                        updateCell.startTime = moment(activeMonthYear)
                          .set('date', indexCell + 1)
                          .set('hours', splitTimeWorkStart[0])
                          .set('minutes', splitTimeWorkStart[1])
                          .set('seconds', 0)
                          .toDate();
                        updateCell.endTime = moment(activeMonthYear)
                          .set('date', indexCell + 1)
                          .set('hours', splitTimeWorkEnd[0])
                          .set('minutes', splitTimeWorkEnd[1])
                          .set('seconds', 0)
                          .toDate();
                      } else if (type === 'work-2') {
                        const splitTimeWorkStart = workTimeTemplate?.workTimeStart2?.split(':');

                        const splitTimeWorkEnd = workTimeTemplate?.workTimeEnd2?.split(':');
                        updateCell.startTime = moment(activeMonthYear)
                          .set('date', indexCell + 1)
                          .set('hours', splitTimeWorkStart[0])
                          .set('minutes', splitTimeWorkStart[1])
                          .set('seconds', 0)
                          .toDate();
                        updateCell.endTime = moment(activeMonthYear)
                          .set('date', indexCell + 1)
                          .set('hours', splitTimeWorkEnd[0])
                          .set('minutes', splitTimeWorkEnd[1])
                          .set('seconds', 0)
                          .toDate();
                      } else if (type === 'work-3') {
                        const splitTimeWorkStart = workTimeTemplate?.workTimeStart3?.split(':');

                        const splitTimeWorkEnd = workTimeTemplate?.workTimeEnd3?.split(':');
                        updateCell.startTime = moment(activeMonthYear)
                          .set('date', indexCell + 1)
                          .set('hours', splitTimeWorkStart[0])
                          .set('minutes', splitTimeWorkStart[1])
                          .set('seconds', 0)
                          .toDate();
                        updateCell.endTime = moment(activeMonthYear)
                          .set('date', indexCell + 1)
                          .set('hours', splitTimeWorkEnd[0])
                          .set('minutes', splitTimeWorkEnd[1])
                          .set('seconds', 0)
                          .toDate();
                      } else if (type === 'work-4') {
                        const splitTimeWorkStart = workTimeTemplate?.workTimeStart4?.split(':');

                        const splitTimeWorkEnd = workTimeTemplate?.workTimeEnd4?.split(':');
                        updateCell.startTime = moment(activeMonthYear)
                          .set('date', indexCell + 1)
                          .set('hours', splitTimeWorkStart[0])
                          .set('minutes', splitTimeWorkStart[1])
                          .set('seconds', 0)
                          .toDate();
                        updateCell.endTime = moment(activeMonthYear)
                          .set('date', indexCell + 1)
                          .set('hours', splitTimeWorkEnd[0])
                          .set('minutes', splitTimeWorkEnd[1])
                          .set('seconds', 0)
                          .toDate();
                      }
                      update(indexCell, {
                        ...dayItem,
                        date: moment(activeMonthYear)
                          .set('date', indexCell + 1)
                          .set('hours', 0)
                          .set('minutes', 0)
                          .set('seconds', 0)
                          .toDate(),
                        ...updateCell,
                      });
                    } else {
                      update(indexCell, {});
                    }
                  }

                  setIsEdited(true);
                  setStart(-1);
                  setEnd(-1);
                }
              }}
              style={{ position: 'relative' }}
              item={dayItem}
            />
          );
        })}

        <td className="work-calendar-full-cell-wrap  sticky-right-td" style={{ position: 'sticky', right: '90px', zIndex: 2, background: '#Fff', width: '30px' }}>
          <div style={{ display: 'grid', gridTemplateRows: '22px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {convertMinsToHrsMins(
                fields
                  ?.map((item1) => {
                    return moment(item1?.endTime).set('seconds', 0).diff(moment(item1?.startTime).set('seconds', 0), 'minutes');
                  })
                  .reduce((partialSum, a) => partialSum + a, 0),
              )}
            </div>
            <div style={{ background: '#e4e4e4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {parseFloat(
                timeTableRow
                  ?.map((item1) => {
                    return item1?.hours || 0;
                  })
                  .reduce((partialSum, a) => partialSum + a, 0),
              ).toFixed(0)}
            </div>
          </div>
        </td>
        <td className="work-calendar-full-cell-wrap work-calendar-full-cell-bold" style={{ position: 'sticky', right: '60px', zIndex: 2, background: '#Fff', width: '30px' }}>
          {fields?.filter((item3) => item3?.type === 'day-off')?.length}
        </td>
        <td className="work-calendar-full-cell-wrap work-calendar-full-cell-bold" style={{ position: 'sticky', right: '30px', zIndex: 2, background: '#Fff', width: '30px' }}>
          {fields?.filter((item3) => item3?.type === 'vacation')?.length}
        </td>
        <td className="work-calendar-full-cell-wrap work-calendar-full-cell-bold" style={{ position: 'sticky', right: '0px', zIndex: 2, background: '#Fff', width: '30px' }}>
          {fields?.filter((item3) => item3?.type === 'sick')?.length}
        </td>
      </tr>
      {lastIndex - 1 == index && (
        <tr class="last-post-row last-post-row-top">
          <td class="work-calendar-full-cell-small-wrap work-calendar-full-cell-bold" colSpan={2} style={{ position: 'sticky', left: '0px', zIndex: 2, backgroundColor: '#fff' }}>
            Кол-во в смену
          </td>
          {onLastCountWorkLast?.map((itemCount, countIndex) => (
            <td class={clsx('work-calendar-full-cell-no-border work-calendar-full-cell-small-wrap work', dayList[countIndex]?.getDay() === 6 ? 'cell-day-sb' : dayList[countIndex]?.getDay() === 0 ? 'cell-day-vs' : '')}>{itemCount}</td>
          ))}
          <td class="work-calendar-full-cell-no-border work-calendar-full-cell-small-wrap work sticky-right-td" style={{ position: 'sticky', right: '90px', zIndex: 2, background: '#Fff', width: '30px' }}></td>
          <td class="work-calendar-full-cell-no-border work-calendar-full-cell-small-wrap work" style={{ position: 'sticky', right: '60px', zIndex: 2, background: '#Fff', width: '30px' }}></td>
          <td class="work-calendar-full-cell-no-border work-calendar-full-cell-small-wrap work" style={{ position: 'sticky', right: '30px', zIndex: 2, background: '#Fff', width: '30px' }}></td>
          <td class="work-calendar-full-cell-no-border work-calendar-full-cell-small-wrap work" style={{ position: 'sticky', right: '0px', zIndex: 2, background: '#Fff', width: '30px' }}></td>
        </tr>
      )}
    </>,
  );
};

export default WorkCalendarFullRow;
