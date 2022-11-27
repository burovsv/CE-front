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
    return h + ':' + m;
  } else return 0;
};
const WorkCalendarFullRow = ({ setIsEdited, item, control, index }) => {
  const {
    getEmployeeUser: { data: dataUser, loading: loadingUser, error: errorUser },
  } = useSelector((state) => state.employee);

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
  const isAccessEditCalendar = () => {
    return dataUser?.postSubdivision?.postId == process.env.REACT_APP_MANAGER_ID || dataUser?.postSubdivision?.postId == process.env.REACT_APP_SELLER_ID || dataUser?.postSubdivision?.postId === 1;
  };
  return (
    <tr>
      <td width="150" className="work-calendar-full-cell-wrap ">
        {item?.firstName} <br />
        {item?.lastName}
      </td>
      <td width="150" className="work-calendar-full-cell-wrap ">
        {item?.post}
      </td>
      {fields?.map((dayItem, indexItem) => {
        return (
          <WorkCalendarFullItem
            onChangeStartTime={(newStartTime) => {
              if (isAccessEditCalendar()) {
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
              if (isAccessEditCalendar()) {
                const resultTime = validateTime(newEndTime, dayItem?.endTime);
                if (resultTime) {
                  const minEndTime = moment(dayItem?.date).set('hours', 21).set('minutes', 0);
                  const currentStartTime = moment(dayItem?.startTime);
                  if (!resultTime.isAfter(minEndTime) && !resultTime.isSameOrBefore(currentStartTime)) {
                    update(indexItem, { ...dayItem, endTime: resultTime.set('seconds', 0).toDate() });
                    setIsEdited(true);
                  }
                }
              }
            }}
            onClickMenu={(type) => {
              console.log(isAccessEditCalendar());
              if (isAccessEditCalendar()) {
                let updateCell = { type };
                if (type) {
                  if (type === 'work' && (!dayItem?.startTime || !dayItem?.endTime)) {
                    updateCell.startTime = moment(activeMonthYear)
                      .set('date', indexItem + 1)
                      .set('hours', 8)
                      .set('minutes', 0)
                      .set('seconds', 0)
                      .toDate();
                    updateCell.endTime = moment(activeMonthYear)
                      .set('date', indexItem + 1)
                      .set('hours', 21)
                      .set('minutes', 0)
                      .set('seconds', 0)
                      .toDate();
                  }
                  update(indexItem, {
                    ...dayItem,
                    date: moment(activeMonthYear)
                      .set('date', indexItem + 1)
                      .set('hours', 0)
                      .set('minutes', 0)
                      .set('seconds', 0)
                      .toDate(),
                    ...updateCell,
                  });
                } else {
                  update(indexItem, {});
                }
                setIsEdited(true);
              }
            }}
            style={{ position: 'relative' }}
            item={dayItem}
          />
        );
      })}

      <td className="work-calendar-full-cell-wrap work-calendar-full-cell-bold">
        {convertMinsToHrsMins(
          fields
            ?.map((item1) => {
              return moment(item1?.endTime).set('seconds', 0).diff(moment(item1?.startTime).set('seconds', 0), 'minutes');
            })
            .reduce((partialSum, a) => partialSum + a, 0),
        )}
      </td>
      <td className="work-calendar-full-cell-wrap work-calendar-full-cell-bold">{fields?.filter((item3) => item3?.type === 'day-off')?.length}</td>
      <td className="work-calendar-full-cell-wrap work-calendar-full-cell-bold">{fields?.filter((item3) => item3?.type === 'vacation')?.length}</td>
    </tr>
  );
};

export default WorkCalendarFullRow;
