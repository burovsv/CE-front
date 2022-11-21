import { current } from '@reduxjs/toolkit';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import { getDayOfWeek } from '../utils/getDayofWeek';
import { getDaysInMonth } from '../utils/getDaysInMouth';
import { randomInt } from '../utils/randomInt';
import SelectMonth from './calendarFull/SelectMonth';
import WorkCalendarFullItem from './calendarFull/WorkCalendarFullItem';
const WorkCalendarFull = ({ onClose }) => {
  const {
    getEmployees: { data: employees, loading: loadingEmployees, error: errorEmployees },
  } = useSelector((state) => state.employee);
  const [currentDate, setCurrentDate] = useState(moment());
  const [allDays, setAllDays] = useState([]);
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
  const defaultValues = {
    calendar: [
      {
        name: 'Гунарь Вячеслав',
        post: 'Управляющий',
        calendar: [
          {
            date: moment('10.11.2022'),
            type: 'work',
            startTime: moment().set('hours', 12).set('minutes', 30),
            endTime: moment().set('hours', 15).set('minutes', 50),
          },
          {
            date: moment('10.11.2022'),
            type: 'vacation',
          },
          {
            date: moment('10.11.2022'),
            type: 'sick',
            startTime: moment().set('hours', 12).set('minutes', 30),
            endTime: moment().set('hours', 15).set('minutes', 50),
          },
          {
            date: moment('10.11.2022'),
            type: 'day-off',
            startTime: moment().set('hours', 12).set('minutes', 30),
            endTime: moment().set('hours', 15).set('minutes', 50),
          },
        ],
      },
    ],
  };
  const { control, register } = useForm({ defaultValues });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'calendar',
  });
  const [employeeData, setEmployeeData] = useState([]);
  useEffect(() => {
    const mounth = parseInt(currentDate.format('M').toString()) - 1;
    const year = parseInt(currentDate.format('YYYY').toString());
    setAllDays(getDaysInMonth(mounth, year));
  }, [currentDate]);

  return (
    <div class="work-calendar-full">
      <button onClick={onClose} className="work-calendar-full-close"></button>
      <div className="work-calendar-full-title">График работы </div>
      <table className="work-calendar-full-grid">
        <tr>
          <td colSpan="2" width="300" className="work-calendar-full-cell-wrap ">
            <div>
              <SelectMonth
                currentMonth={currentDate}
                onNextMonth={() => {
                  setCurrentDate((prev) => {
                    return moment(prev).add(1, 'months');
                  });
                }}
                onPrevMonth={() => {
                  setCurrentDate((prev) => {
                    return moment(prev).subtract(1, 'months');
                  });
                }}
              />
            </div>
          </td>
          {allDays?.map((day) => {
            const numberDayOfWeek = day?.getDay();
            return (
              <td width="75" style={{ width: '75px' }} className="work-calendar-full-cell-wrap ">
                <div className={`work-calendar-full-day-of-week ${(numberDayOfWeek === 5 || numberDayOfWeek === 6) && 'work-calendar-full-day-of-week--red'}`}>{getDayOfWeek(numberDayOfWeek)}</div>
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
        {employees?.map((item) => {
          return (
            <tr>
              <td width="150" className="work-calendar-full-cell-wrap ">
                {item?.firstName} <br />
                {item?.lastName}
              </td>
              <td width="150" className="work-calendar-full-cell-wrap ">
                {item?.post}
              </td>
              {allDays?.map((dayItem, index) => {
                return (
                  <WorkCalendarFullItem
                    item={{
                      type: dayItem?.getDay() === 5 || dayItem?.getDay() === 6 ? 'day-off' : index === 0 || index === 1 || index === 2 ? 'vacation' : index === allDays?.length - 1 || index === allDays?.length - 2 || index === allDays?.length - 3 ? 'sick' : 'work',
                      startTime: moment().set('hours', randomInt(8, 12)).set('minutes', randomInt(0, 60)),
                      endTime: moment().set('hours', randomInt(14, 17)).set('minutes', randomInt(0, 60)),
                    }}
                  />
                );
              })}

              {allDays?.length - item?.calendar?.length >= 1 &&
                Array(allDays?.length - item?.calendar?.length)
                  .fill()
                  .map(() => (
                    <td className="work-calendar-full-cell-wrap ">
                      <div className="work-calendar-full-cell-empty"></div>
                    </td>
                  ))}
              <td className="work-calendar-full-cell-wrap work-calendar-full-cell-bold">{randomInt(200, 300)}</td>
              <td className="work-calendar-full-cell-wrap work-calendar-full-cell-bold">{randomInt(1, 6)}</td>
              <td className="work-calendar-full-cell-wrap work-calendar-full-cell-bold">{randomInt(0, 6)}</td>
            </tr>
          );
        })}
        <tr>
          <td colSpan="2" class="work-calendar-full-cell-thin">
            Кол-во сотрудников в смену
          </td>
          {allDays?.map(() => (
            <td class="work-calendar-full-cell-no-border">{randomInt(0, 5)}</td>
          ))}
          <td colSpan="3" style={{ textAlign: 'center', padding: 0 }} class="work-calendar-full-cell-thin">
            {randomInt(100, 150)}
          </td>
        </tr>
        <tr>
          <td colSpan="2" class="work-calendar-full-cell-thin">
            Кол-во сотрудников с открытие
          </td>
          {allDays?.map(() => (
            <td class="work-calendar-full-cell-no-border"> {randomInt(100, 150)}</td>
          ))}
          <td colSpan="3" style={{ textAlign: 'center', padding: 0 }} class="work-calendar-full-cell-thin">
            {randomInt(100, 150)}
          </td>
        </tr>
        <tr>
          <td colSpan="2" class="work-calendar-full-cell-thin">
            Кол-во сотрудников с закрытие
          </td>
          {allDays?.map(() => (
            <td class="work-calendar-full-cell-no-border">{randomInt(0, 5)}</td>
          ))}
          <td colSpan="3" style={{ textAlign: 'center', padding: 0 }} class="work-calendar-full-cell-thin">
            {randomInt(100, 150)}
          </td>
        </tr>
      </table>
      <div style={{ display: 'flex', marginTop: '50px', justifyContent: 'space-between', alignItems: 'center', maxWidth: 'min-content' }}>
        <div style={{ display: 'flex' }}>
          {exampleCalendar?.map((dayItem) => {
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <WorkCalendarFullItem style={{ width: '75px' }} item={dayItem} />
                <div style={{ fontWeight: '700', marginLeft: '25px', marginRight: '50px', whiteSpace: 'nowrap' }}>{dayItem?.example}</div>
              </div>
            );
          })}
        </div>
        <button class="report__btn" style={{ marginLeft: '50px' }}>
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default WorkCalendarFull;
