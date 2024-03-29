import { current } from '@reduxjs/toolkit';
import clsx from 'clsx';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import { getEmployees } from '../redux/actions/employee/getEmployees.action';
import { upsertWorkCalendarFull } from '../redux/actions/workCalendar/upsertWorkCalendarFull.slice';
import { setActiveCalendarDates } from '../redux/slices/news.slice';
import { resetUpsertWorkCalendarFull, setActiveMonthYear } from '../redux/slices/workCalendar.slice';
import { getDayOfWeek } from '../utils/getDayofWeek';
import { getDaysInMonth } from '../utils/getDaysInMouth';
import { randomInt } from '../utils/randomInt';
import SelectMonth from './calendarFull/SelectMonth';
import WorkCalendarFullItem from './calendarFull/WorkCalendarFullItem';
import WorkCalendarFullRow from './calendarFull/WorkCalendarFullRow';
const TimeTableFull = () => {
  const {
    getEmployees: { data: employees, loading: loadingEmployees, error: errorEmployees },
    getEmployeeUser: { data: dataUser, loading: loadingUser, error: errorUser },
  } = useSelector((state) => state.employee);
  const {
    getEmployeeHistory: { data: employeeHistory },
    activeCalendarSubdivision,
  } = useSelector((state) => state.employeeHistory);
  const [isEdited, setIsEdited] = useState(false);
  const [allDays, setAllDays] = useState([]);
  const {
    activeMonthYear,

    getWorkCalendarMonth: { loading: workCalendarMonthLoading },
    upsertWorkCalendarFull: { data: upsertWorkCalendarData, loading: upsertWorkCalendarLoading, error: upsertWorkCalendarError },
  } = useSelector((state) => state.workCalendar);
  const exampleCalendar = [
    {
      date: moment('10.11.2022'),
      type: 'work',
      startTime: moment().set('hours', 12).set('minutes', 30),
      endTime: moment().set('hours', 15).set('minutes', 50),
      example: 'Рабочий день',
    },
    {
      date: moment('10.11.2022'),
      type: 'vacation',
      example: 'Отпуск',
    },
    {
      date: moment('10.11.2022'),
      type: 'sick',
      startTime: moment().set('hours', 12).set('minutes', 30),
      endTime: moment().set('hours', 15).set('minutes', 50),
      example: 'Больничный',
    },
    {
      date: moment('10.11.2022'),
      type: 'day-off',
      startTime: moment().set('hours', 12).set('minutes', 30),
      endTime: moment().set('hours', 15).set('minutes', 50),
      example: 'Выходной',
    },
  ];
  const [totalCountWorkers, setTotalCountWorkers] = useState([]);
  const [totalCountMinEndTimeWorkers, setTotalCountMinEndTimeWorkers] = useState([]);
  const [totalCountMinStartTimeWorkers, setTotalCountMinStartTimeWorkers] = useState([]);
  const { control, register, setValue, watch, handleSubmit, reset } = useForm({ defaultValues: { calendar: [] } });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'calendar',
  });
  console.log(watch());
  useEffect(() => {
    reset();
    const paramsEmployees = { page: 0, search: '', subdivision: activeCalendarSubdivision?.id, dateCalendar: moment(activeMonthYear).format("YYYY-MM-DD").toString() };
    dispatch(getEmployees(paramsEmployees));
  }, [activeMonthYear]);
  const onSubmit = (data) => {
    setIsEdited(false);
    dispatch(upsertWorkCalendarFull({ calendar: data?.calendar, monthYear: activeMonthYear, subdivision: activeCalendarSubdivision?.id }));
  };
  useEffect(() => {
    if (employees?.length >= 1) {
      const mounth = parseInt(moment(activeMonthYear).format('M').toString()) - 1;
      const year = parseInt(moment(activeMonthYear).format('YYYY').toString());
      const allDaysGenerate = getDaysInMonth(mounth, year);
      setAllDays(allDaysGenerate);
      const formatEmployees = employees?.map((employee) => {
        const formatCellCalendar = {
          userId: employee.id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          post: employee.post,
          existWorkCalendarId: null,
          calendarData: [],
        };

        const fillCalendarData = allDaysGenerate?.map((dayItem) => {
          const findEqualDay = employee?.timeTable?.find((itemTimeTable) => {
            const cellMoment = moment(itemTimeTable?.date_time);
            const dayMoment = moment(dayItem);
            const isValidDates = moment(dayMoment).isValid() && moment(cellMoment).isValid();
            if (!isValidDates) {
              return false;
            }
            const cellMomentFormat = cellMoment.format('DD.MM.YYYY');
            const dayMomentFormat = dayMoment.format('DD.MM.YYYY');
            if (cellMomentFormat === dayMomentFormat && itemTimeTable?.hours !== 0) {
              return true;
            }
          });
          if (findEqualDay) {
            return {
              date: dayItem,
              type: 'hours',
              hours: findEqualDay?.hours,
            };
          } else {
            return {};
          }
        });
        formatCellCalendar.calendarData = fillCalendarData;

        return formatCellCalendar;
      });
      setValue('calendar', formatEmployees);
    }
  }, [employees]);

  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
  }, []);
  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const dispatch = useDispatch();
  const countMinTimeWorkers = (val, day, prop) => {
    const allMinTimes = [];
    val?.map((workers) => {
      if (workers?.calendarData[day]?.type === 'work') {
        allMinTimes.push(moment(workers?.calendarData[day]?.[prop]).format('HH:mm').toString() + ':00');
      }
    });
    if (allMinTimes?.length >= 1) {
      allMinTimes.sort(function (a, b) {
        return a.localeCompare(b);
      });
      const minTime = prop === 'endTime' ? allMinTimes[allMinTimes?.length - 1] : allMinTimes[0];
      return allMinTimes.filter((workers) => workers === minTime).length;
    } else {
      return 0;
    }
  };

  const countWorkers = (val, day) => {
    return val
      ?.map((workers) => {
        return workers?.calendarData[day]?.type === 'work' ? true : false;
      })
      .filter((workers) => workers).length;
  };
  const [showSaved, setShowSaved] = useState(false);
  useEffect(() => {
    if (upsertWorkCalendarData) {
      setShowSaved(true);
      dispatch(resetUpsertWorkCalendarFull());
      setTimeout(() => {
        setShowSaved(false);
      }, 3000);
    }
  }, [upsertWorkCalendarData]);

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      let totalWorkers1 = [];
      let totalWorkers2 = [];
      let totalWorkers3 = [];
      allDays?.map((item, dayIndex) => {
        totalWorkers1.push(countWorkers(value?.calendar, dayIndex));
        totalWorkers2.push(countMinTimeWorkers(value?.calendar, dayIndex, 'startTime'));
        totalWorkers3.push(countMinTimeWorkers(value?.calendar, dayIndex, 'endTime'));
      });
      setTotalCountWorkers(totalWorkers1);
      setTotalCountMinStartTimeWorkers(totalWorkers2);
      setTotalCountMinEndTimeWorkers(totalWorkers3);
    });
    return () => subscription.unsubscribe();
  }, [watch, allDays]);
  return (
    <>
      <div className="work-calendar-full-title" style={{ marginTop: '100px' }}>
        <div>Табель {activeCalendarSubdivision?.name}</div>
      </div>
      <table className={clsx('work-calendar-full-grid')}>
        <tr>
          <td colSpan="2" width="300" className="work-calendar-full-cell-wrap ">
            <div>
              <SelectMonth
                currentMonth={activeMonthYear}
                onNextMonth={() => {
                  setIsEdited(false);
                  dispatch(setActiveMonthYear(moment(activeMonthYear).add(1, 'months').toString()));
                }}
                onPrevMonth={() => {
                  setIsEdited(false);
                  dispatch(setActiveMonthYear(moment(activeMonthYear).subtract(1, 'months').toString()));
                }}
              />
            </div>
          </td>
          {allDays?.map((day) => {
            const numberDayOfWeek = day?.getDay();
            return (
              <td width="75" style={{ width: '75px' }} className="work-calendar-full-cell-wrap ">
                <div className={`work-calendar-full-day-of-week ${(numberDayOfWeek === 6 || numberDayOfWeek === 0) && 'work-calendar-full-day-of-week--red'}`}>{getDayOfWeek(numberDayOfWeek)}</div>
              </td>
            );
          })}
          <td width="300" colSpan="3" className="work-calendar-full-cell-wrap work-calendar-full-cell-bold">
            Итого
          </td>
        </tr>
        <tr>
          <td width="150" class="work-calendar-full-cell-wrap work-calendar-full-cell-bold">
            ФИО
          </td>
          <td width="150" class="work-calendar-full-cell-wrap work-calendar-full-cell-bold">
            Должность
          </td>
          {allDays?.map((day) => {
            return (
              <td width="75" style={{ width: '75px' }} className="work-calendar-full-cell-wrap ">
                <div className={`work-calendar-full-cell-bold`}>{moment(day).format('D').toString()}</div>
              </td>
            );
          })}
          <td width="100" className="work-calendar-full-cell-wrap work-calendar-full-cell-bold">
            кол-во <br />
            часов
          </td>{' '}
          <td width="100" className="work-calendar-full-cell-wrap work-calendar-full-cell-bold">
            кол-во <br />
            выходных
          </td>{' '}
          <td width="100" className="work-calendar-full-cell-wrap work-calendar-full-cell-bold">
            кол-во <br />
            дней отпуска
          </td>
        </tr>
        {fields?.map((item, index) => {
          return <WorkCalendarFullRow isTimeTable isAccessEdit={false} setIsEdited={setIsEdited} item={item} index={index} control={control} />;
        })}
        <tr>
          <td colSpan="2" class="work-calendar-full-cell-thin">
            Кол-во сотрудников в смену
          </td>
          {totalCountWorkers?.map((item) => (
            <td class="work-calendar-full-cell-no-border work-calendar-full-cell-wrap work">{item}</td>
          ))}
          <td colSpan="3" style={{ textAlign: 'center', padding: 0 }} class="work-calendar-full-cell-thin">
            {totalCountWorkers.reduce((partialSum, a) => partialSum + a, 0)}
          </td>
        </tr>
        <tr>
          <td colSpan="2" class="work-calendar-full-cell-thin">
            Кол-во сотрудников с открытие
          </td>
          {totalCountMinStartTimeWorkers?.map((item2) => (
            <td class="work-calendar-full-cell-no-border work-calendar-full-cell-wrap work"> {item2}</td>
          ))}
          <td colSpan="3" style={{ textAlign: 'center', padding: 0 }} class="work-calendar-full-cell-thin">
            {totalCountMinStartTimeWorkers.reduce((partialSum, a) => partialSum + a, 0)}
          </td>
        </tr>
        <tr>
          <td colSpan="2" class="work-calendar-full-cell-thin">
            Кол-во сотрудников с закрытие
          </td>
          {totalCountMinEndTimeWorkers?.map((item3) => (
            <td class="work-calendar-full-cell-no-border work-calendar-full-cell-wrap work">{item3}</td>
          ))}
          <td colSpan="3" style={{ textAlign: 'center', padding: 0 }} class="work-calendar-full-cell-thin">
            {totalCountMinEndTimeWorkers.reduce((partialSum, a) => partialSum + a, 0)}
          </td>
        </tr>
      </table>
    </>
  );
};

export default TimeTableFull;
