import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import WorkCalendarFullItem from './WorkCalendarFullItem';
export const convertMinsToHrsMins = (minutes) => {
  if (minutes) {
    var h = Math.floor(minutes / 60);
    var m = minutes % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return h;
  } else return 0;
};
const WorkCalendarFullRow = ({ isTimeTable, setIsEdited, item, control, index, isAccessEdit, timeTableRow }) => {
  const {
    getEmployeeUser: { data: dataUser, loading: loadingUser, error: errorUser },
  } = useSelector((state) => state.employee);
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
  console.log(start);
  console.log(end);
  return (
    <tr>
      <td width="150" className="work-calendar-full-cell-wrap " style={{ position: 'sticky', left: '0px', zIndex: 2, backgroundColor: '#fff' }}>
        {item?.firstName} <br />
        {item?.lastName}
      </td>
      <td width="150" className="work-calendar-full-cell-wrap " style={{ position: 'sticky', left: '100px', zIndex: 2, backgroundColor: '#fff' }}>
        {item?.post}
      </td>
      {fields?.map((dayItem, indexItem) => {
        return (
          <WorkCalendarFullItem
            resetSelection={() => {
              // setStart(-1);
              // setEnd(-1);
            }}
            className={(end <= indexItem && indexItem <= start) || (start <= indexItem && indexItem <= end) ? 'cell-selected' : ''}
            onMouseDown={(e) => {
              if (e.nativeEvent.button === 2) {
                beginSelection(indexItem);
              }
            }}
            onMouseUp={(e) => {
              if (e.nativeEvent.button === 2) {
                endSelection(indexItem);
              }
            }}
            onMouseMove={() => updateSelection(indexItem)}
            timeTableItem={timeTableRow?.[indexItem]}
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

      <td className="work-calendar-full-cell-wrap  sticky-right-td" style={{ position: 'sticky', right: '225px', zIndex: 2, background: '#Fff' }}>
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
            ).toFixed(2)}
          </div>
        </div>
      </td>
      <td className="work-calendar-full-cell-wrap work-calendar-full-cell-bold" style={{ position: 'sticky', right: '150px', zIndex: 2, background: '#Fff' }}>
        {fields?.filter((item3) => item3?.type === 'day-off')?.length}
      </td>
      <td className="work-calendar-full-cell-wrap work-calendar-full-cell-bold" style={{ position: 'sticky', right: '75px', zIndex: 2, background: '#Fff' }}>
        {fields?.filter((item3) => item3?.type === 'vacation')?.length}
      </td>
      <td className="work-calendar-full-cell-wrap work-calendar-full-cell-bold" style={{ position: 'sticky', right: '0px', zIndex: 2, background: '#Fff' }}>
        {fields?.filter((item3) => item3?.type === 'sick')?.length}
      </td>
    </tr>
  );
};

export default WorkCalendarFullRow;
