import { current } from '@reduxjs/toolkit';
import clsx from 'clsx';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import { getEmployees } from '../redux/actions/employee/getEmployees.action';
import { upsertWorkCalendarFull } from '../redux/actions/workCalendar/upsertWorkCalendarFull.slice';
import { setActiveCalendarDates } from '../redux/slices/news.slice';
import { setWorkTimeTemplate } from '../redux/slices/subdivision.slice';
import { resetExportWorkCalendarToExcel, resetSwitchAcceptWorkTable, resetUpsertWorkCalendarFull, setActiveMonthYear } from '../redux/slices/workCalendar.slice';
import { getDayOfWeek } from '../utils/getDayofWeek';
import { getDaysInMonth } from '../utils/getDaysInMouth';
import { randomInt } from '../utils/randomInt';
import SelectMonth from './calendarFull/SelectMonth';
import WorkCalendarFullItem from './calendarFull/WorkCalendarFullItem';
import WorkCalendarFullRow from './calendarFull/WorkCalendarFullRow';
import TimeTableFull from './TimeTableFull';
import { workTableToExcelFormat } from '../utils/workTableToExcelFormat';
import { exportWorkCalendarToExcel } from '../redux/actions/workCalendar/exportWorkCalendarToExcel.slice';
import fileDownload from 'js-file-download';
import axios from 'axios';
import { getEmployeeHiddenList } from '../redux/actions/employeeHidden/getEmployeeHiddenList.action';
import { resetEmployeeToHiddenList } from '../redux/slices/employee.slice';
import { switchAcceptWorkTable } from '../redux/actions/workCalendar/switchAcceptWorkTable.slice';
import { getAcceptWorkTableSingle } from '../redux/actions/workCalendar/getAcceptWorkTableSingle.slice';
const WorkCalendarFull = ({ onClose, onOpenAccept }) => {
  const {
    auth: { role, editorWorkTable },
  } = useSelector((state) => state.app);
  const {
    getEmployees: { data: employees, loading: loadingEmployees, error: errorEmployees },
    getEmployeeUser: { data: dataUser, loading: loadingUser, error: errorUser },
    hiddenEmployeeList,
  } = useSelector((state) => state.employee);
  const {
    getSubdivisionWorkTimeTemplates: { data: workTimeTemplates },
    workTimeTemplate,
  } = useSelector((state) => state.subdivision);
  const {
    getEmployeeHistory: { data: employeeHistory },
    activeCalendarSubdivision,
  } = useSelector((state) => state.employeeHistory);
  const {
    getEmployeeHiddenList: { data: getEmployeeHiddenData, loading: getEmployeeHiddenLoading },
  } = useSelector((state) => state.employeeHidden);
  const [isEdited, setIsEdited] = useState(false);
  const [showHiddenEmployees, setShowHiddenEmployees] = useState(false);
  const [allDays, setAllDays] = useState([]);
  const {
    activeMonthYear,

    getWorkCalendarMonth: { loading: workCalendarMonthLoading },
    upsertWorkCalendarFull: { data: upsertWorkCalendarData, loading: upsertWorkCalendarLoading, error: upsertWorkCalendarError },
    exportWorkCalendarToExcel: { data: downloadData },
    getAcceptWorkTableSingle: { data: getAcceptWorkTableSingleData },
    switchAcceptWorkTable: { data: switchAcceptWorkTableData, loading: switchAcceptWorkTableLoading },
  } = useSelector((state) => state.workCalendar);
  const acceptForm = useForm();
  useEffect(() => {
    if (getAcceptWorkTableSingleData) {
      acceptForm.setValue('directorComment', getAcceptWorkTableSingleData?.directorComment);
      acceptForm.setValue('managerComment', getAcceptWorkTableSingleData?.managerComment);
    } else {
      acceptForm.setValue('directorComment', '');
      acceptForm.setValue('managerComment', '');
    }
  }, [getAcceptWorkTableSingleData]);

  console.log(workTimeTemplates);
  useEffect(() => {
    if (workTimeTemplates) {
      let existWorkTimeTemplate = {};
      if (workTimeTemplates?.timeStart1 && validateTime(workTimeTemplates?.timeStart1)) {
        existWorkTimeTemplate.workTimeStart1 = workTimeTemplates?.timeStart1;
      }
      if (workTimeTemplates?.timeStart2 && validateTime(workTimeTemplates?.timeStart2)) {
        existWorkTimeTemplate.workTimeStart2 = workTimeTemplates?.timeStart2;
      }
      if (workTimeTemplates?.timeStart3 && validateTime(workTimeTemplates?.timeStart3)) {
        existWorkTimeTemplate.workTimeStart3 = workTimeTemplates?.timeStart3;
      }
      if (workTimeTemplates?.timeStart4 && validateTime(workTimeTemplates?.timeStart4)) {
        existWorkTimeTemplate.workTimeStart4 = workTimeTemplates?.timeStart4;
      }
      if (workTimeTemplates?.timeEnd2 && validateTime(workTimeTemplates?.timeEnd2)) {
        existWorkTimeTemplate.workTimeEnd2 = workTimeTemplates?.timeEnd2;
      }
      if (workTimeTemplates?.timeEnd1 && validateTime(workTimeTemplates?.timeEnd1)) {
        existWorkTimeTemplate.workTimeEnd1 = workTimeTemplates?.timeEnd1;
      }
      if (workTimeTemplates?.timeEnd3 && validateTime(workTimeTemplates?.timeEnd3)) {
        existWorkTimeTemplate.workTimeEnd3 = workTimeTemplates?.timeEnd3;
      }
      if (workTimeTemplates?.timeEnd4 && validateTime(workTimeTemplates?.timeEnd4)) {
        existWorkTimeTemplate.workTimeEnd4 = workTimeTemplates?.timeEnd4;
      }
      existWorkTimeTemplate.active1 = workTimeTemplates.active1;
      existWorkTimeTemplate.active2 = workTimeTemplates.active2;
      existWorkTimeTemplate.active3 = workTimeTemplates.active3;
      existWorkTimeTemplate.active4 = workTimeTemplates.active4;
      dispatch(setWorkTimeTemplate({ ...workTimeTemplate, ...existWorkTimeTemplate }));
    }
  }, [workTimeTemplates]);

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
  const { getValues, control, register, setValue, watch, handleSubmit, reset } = useForm({ defaultValues: { calendar: [] } });
  const { fields, append, prepend, remove, swap, move, insert, update } = useFieldArray({
    control,
    name: 'calendar',
  });
  console.log(fields);
  useEffect(() => {
    reset();
    const paramsEmployees = { page: 0, search: '', subdivision: activeCalendarSubdivision?.id, dateCalendar: moment(activeMonthYear).format('YYYY-MM-DD').toString() };
    dispatch(getEmployees(paramsEmployees));
    dispatch(getEmployeeHiddenList(activeCalendarSubdivision?.id));
    dispatch(resetEmployeeToHiddenList());
  }, [activeMonthYear]);
  const onSubmit = (data) => {
    setIsEdited(false);
    dispatch(upsertWorkCalendarFull({ calendar: data?.calendar, monthYear: activeMonthYear, subdivision: activeCalendarSubdivision?.id, workTimeTemplate, hiddenEmployees: hiddenEmployeeList }));
  };
  useEffect(() => {
    if (employees?.length >= 1) {
      const mounth = parseInt(moment(activeMonthYear).format('M').toString()) - 1;
      const year = parseInt(moment(activeMonthYear).format('YYYY').toString());
      const allDaysGenerate = getDaysInMonth(mounth, year);
      setAllDays(allDaysGenerate);
      const formatEmployees = employees?.map((employee) => {
        const formatCellCalendar = {
          isLastPost: employee.isLastPost,
          userId: employee.id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          orderEmployee: employee.orderEmployee,
          post: employee.post,
          groupPost: employee.groupPost,
          timeTable: employee.timeTable,
          existWorkCalendarId: employee?.workCalendars?.[0]?.id,
          calendarData: [],
        };

        let parseCalendarData = [];
        try {
          parseCalendarData = JSON.parse(employee?.workCalendars[0]?.calendarData);
        } catch (error) {}

        const fillCalendarData = allDaysGenerate?.map((dayItem) => {
          const findEqualDay = parseCalendarData?.find((parseItem) => {
            const cellMoment = moment(parseItem?.date);
            const dayMoment = moment(dayItem);
            const isValidDates = moment(dayMoment).isValid() && moment(cellMoment).isValid();
            if (!isValidDates) {
              return false;
            }
            const cellMomentFormat = cellMoment.format('DD.MM.YYYY');
            const dayMomentFormat = dayMoment.format('DD.MM.YYYY');
            if (cellMomentFormat === dayMomentFormat) {
              return true;
            }
          });
          if (findEqualDay) {
            return findEqualDay;
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
  const isAccessEditCalendar = () => {
    return dataUser?.subdivisions?.find((subdivFind) => subdivFind?.id == activeCalendarSubdivision?.id) || dataUser?.postSubdivision?.postId === 1;
    // return true;
  };
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

  const countWorkers = (val, day, groupPost) => {
    return val
      ?.map((workers) => {
        return workers?.calendarData?.[day]?.type === 'work' && (!groupPost ? true : workers?.groupPost == groupPost ? true : false) ? true : false;
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
  const [showSavedAccept, setShowSavedAccept] = useState(false);
  useEffect(() => {
    if (switchAcceptWorkTableData) {
      setShowSavedAccept(true);

      dispatch(
        getAcceptWorkTableSingle({
          date: moment(activeMonthYear).format('YYYY-MM-DD').toString(),
          subdivisionId: activeCalendarSubdivision?.id,
        }),
      );
      dispatch(resetSwitchAcceptWorkTable());
      setTimeout(() => {
        setShowSavedAccept(false);
      }, 3000);
    }
  }, [switchAcceptWorkTableData]);
  const validateTime = (time) => {
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
    const dateWithUpdatTime = moment().set('hours', splitTime[0]).set('minutes', splitTime[1]);
    if (dateWithUpdatTime.isValid()) {
      return dateWithUpdatTime;
    }
  };
  const onChangeEndTime = (newStartTime, startName, endName) => {
    const resultTime = validateTime(newStartTime);
    const currentStartTime = validateTime(workTimeTemplate?.[startName]);
    const minEndTime = moment().set('hours', 23).set('minutes', 0);
    if (resultTime) {
      if (!resultTime.isAfter(minEndTime) && !resultTime.isSameOrBefore(currentStartTime)) {
        dispatch(setWorkTimeTemplate({ ...workTimeTemplate, [endName]: resultTime.format('HH:mm') }));
      } else {
        dispatch(setWorkTimeTemplate({ ...workTimeTemplate, [endName]: minEndTime.format('HH:mm') }));
      }
    } else {
      dispatch(setWorkTimeTemplate({ ...workTimeTemplate, [endName]: minEndTime.format('HH:mm') }));
    }
  };
  const onChangeStartTime = (newStartTime, startName, endName) => {
    const resultTime = validateTime(newStartTime);
    const currentEndTime = validateTime(workTimeTemplate?.[endName]);
    const minStartTime = moment().set('hours', 8).set('minutes', 0);
    if (resultTime) {
      if (!resultTime.isBefore(minStartTime) && !resultTime.isSameOrAfter(currentEndTime)) {
        dispatch(setWorkTimeTemplate({ ...workTimeTemplate, [startName]: resultTime.format('HH:mm') }));
      } else {
        dispatch(setWorkTimeTemplate({ ...workTimeTemplate, [startName]: minStartTime.format('HH:mm') }));
      }
    } else {
      dispatch(setWorkTimeTemplate({ ...workTimeTemplate, [startName]: minStartTime.format('HH:mm') }));
    }
  };
  const watchCalendar = watch('calendar');

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
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState();
  const [scrollLeft, setScrollLeft] = useState();
  const refTableWrap = useRef(null);
  const touchMouseDown = (e) => {
    if (e.nativeEvent.button === 0) {
      setIsDown(true);
      setStartX(e.pageX - refTableWrap.current.offsetLeft);
      setScrollLeft(refTableWrap.current.scrollLeft);
    }
  };
  const touchMouseLeave = (e) => {
    setIsDown(false);
  };
  const touchMouseUp = (e) => {
    setIsDown(false);
  };
  const touchMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - refTableWrap.current.offsetLeft;
    const walk = x - startX;
    refTableWrap.current.scrollLeft = scrollLeft - walk;
  };
  const [selectedColumn, setSelectedColumn] = useState(-1);
  const tableRef = useRef(null);
  useEffect(() => {
    if (downloadData?.file) {
      axios
        .get(downloadData?.file, {
          responseType: 'blob',
        })
        .then((res) => {
          fileDownload(res.data, downloadData?.fileName);
          dispatch(resetExportWorkCalendarToExcel());
        });
    }
  }, [downloadData]);
  const onSubmitManagerAccept = (data) => {
    dispatch(switchAcceptWorkTable({ subdivisionId: activeCalendarSubdivision?.id, date: moment(activeMonthYear).format('YYYY-MM-DD').toString(), status: 'waiting', managerComment: data?.managerComment }));
  };
  const onSubmitDirectorAccept = (data) => {
    dispatch(switchAcceptWorkTable({ subdivisionId: activeCalendarSubdivision?.id, date: moment(activeMonthYear).format('YYYY-MM-DD').toString(), status: 'accept', directorComment: data?.directorComment }));
  };
  const onSubmitDirectorCancel = (data) => {
    dispatch(switchAcceptWorkTable({ subdivisionId: activeCalendarSubdivision?.id, date: moment(activeMonthYear).format('YYYY-MM-DD').toString(), status: '', directorComment: data?.directorComment }));
  };
  return (
    <div class="work-calendar-full">
      {/* <button onClick={() => onClose(isEdited)} className="work-calendar-full-close"></button> */}
      <div className="work-calendar-full-title">
        <div>График работы {activeCalendarSubdivision?.name}</div>
        {upsertWorkCalendarLoading && <div className="loading-account">&nbsp;Идет сохранение...</div>}
        {(loadingEmployees || getEmployeeHiddenLoading) && <div className="loading-account">&nbsp;Идет загрузка...</div>}
        {showSaved && <span style={{ color: 'green' }}>&nbsp;Сохранено!</span>}
        {upsertWorkCalendarError && <span style={{ color: 'red' }}>&nbsp;Ошибка!</span>}
        {isEdited && <span style={{ color: 'red' }}>&nbsp;был изменен, сохраните!</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        {isAccessEditCalendar() && (
          <button onClick={handleSubmit(onSubmit)} class="report__btn" style={{ marginLeft: '0px' }} disabled={upsertWorkCalendarLoading || loadingEmployees || getEmployeeHiddenLoading}>
            {loadingEmployees || getEmployeeHiddenLoading ? <div className="loading-account">Идет загрузка...</div> : upsertWorkCalendarLoading ? <div className="loading-account">Идет сохранение...</div> : 'Сохранить'}
          </button>
        )}
        <button
          onClick={() => {
            const tableData = workTableToExcelFormat(tableRef.current.querySelectorAll('tr'));
            dispatch(exportWorkCalendarToExcel({ tableData }));
          }}
          class="report__btn"
          style={{ marginLeft: '20px' }}
          disabled={upsertWorkCalendarLoading || loadingEmployees || getEmployeeHiddenLoading}>
          {loadingEmployees || getEmployeeHiddenLoading ? <div className="loading-account">Идет загрузка...</div> : upsertWorkCalendarLoading ? <div className="loading-account">Идет сохранение...</div> : 'Скачать'}
        </button>

        <button onClick={() => onClose(isEdited)} class="report__btn" style={{ marginLeft: '20px', background: '#FC0000', color: '#fff' }}>
          Закрыть
        </button>
        {isEdited && <div style={{ fontWeight: '600', color: '#fc0000', maxWidth: '310px', marginLeft: '20px' }}>Вы сделали изминение в графике, если хотите сохранить нажмите на кнопку сохранить</div>}
        {isAccessEditCalendar() && (
          <>
            {' '}
            {dataUser?.postSubdivision?.postId == process.env.REACT_APP_DIRECTOR_POST_ID || dataUser?.id == 166 ? (
              <>
                <input style={{ height: '44.22px', border: '1px solid #C0C0C0', padding: '0 10px', width: '205px', marginLeft: '20px' }} {...acceptForm.register('directorComment')} />
                <button disabled={switchAcceptWorkTableLoading} onClick={acceptForm.handleSubmit(onSubmitDirectorAccept)} class="report__btn" style={{ backgroundColor: '#2D7700', color: '#fff', marginLeft: '20px' }}>
                  Согласованно
                </button>
                <button disabled={switchAcceptWorkTableLoading} onClick={acceptForm.handleSubmit(onSubmitDirectorCancel)} class="report__btn" style={{ backgroundColor: 'rgb(252, 0, 0)', color: '#fff', marginLeft: '20px' }}>
                  Отказать
                </button>
                {acceptForm.watch('managerComment') && (
                  <div style={{ marginLeft: '20px' }}>
                    Коментарий управляющего: <b>{acceptForm.watch('managerComment')}</b>
                  </div>
                )}
              </>
            ) : getAcceptWorkTableSingleData?.status == 'accept' ? (
              <>
                <div style={{ color: '#007D32', marginLeft: '20px' }}>Согласованно</div>
                {acceptForm.watch('directorComment') && (
                  <div style={{ marginLeft: '20px' }}>
                    Коментарий директора: <b>{acceptForm.watch('directorComment')}</b>
                  </div>
                )}
              </>
            ) : getAcceptWorkTableSingleData?.status == 'waiting' ? (
              <>
                <button class="report__btn" style={{ backgroundColor: '#B4B4B4', color: '#fff', marginLeft: '20px' }} disabled={true}>
                  Ожидание согласование
                </button>
              </>
            ) : (
              <>
                <input style={{ height: '44.22px', border: '1px solid #C0C0C0', padding: '0 10px', width: '205px', marginLeft: '20px' }} {...acceptForm.register('managerComment')} />
                <button disabled={switchAcceptWorkTableLoading} onClick={acceptForm.handleSubmit(onSubmitManagerAccept)} class="report__btn" style={{ backgroundColor: 'rgb(252, 0, 0)', color: '#fff', marginLeft: '20px' }}>
                  {switchAcceptWorkTableLoading ? 'Отправка...' : 'Отправить на согласование'}
                </button>{' '}
                {acceptForm.watch('directorComment') && (
                  <div style={{ marginLeft: '20px' }}>
                    Коментарий директора: <b>{acceptForm.watch('directorComment')}</b>
                  </div>
                )}
              </>
            )}
            {showSavedAccept && <span style={{ marginLeft: '20px', color: 'green' }}>&nbsp;Отправленно!</span>}
          </>
        )}

        {/* {acceptForm.watch('directorComment') && } */}
      </div>
      {isAccessEditCalendar() && (
        <div style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginRight: '20px' }}>
            <label>
              <input
                defaultChecked={workTimeTemplate.active1}
                checked={workTimeTemplate.active1}
                type="checkbox"
                onChange={(event) => {
                  dispatch(setWorkTimeTemplate({ ...workTimeTemplate, active1: event.target.checked }));
                }}
              />
              <span></span>
            </label>
            <div style={{ whiteSpace: 'nowrap' }}>Рабочий день 1 смена:</div>
            <NumberFormat
              onBlur={(e) => {
                onChangeStartTime(e.target.value, 'workTimeStart1', 'workTimeEnd1');
              }}
              style={{ marginLeft: '20px', padding: 0, textAlign: 'center', width: '40px', height: '20px', paddingTop: '1px', marginTop: '0px', border: 'none', outline: 'none', fontSize: '10px', paddingBottom: '1px', backgroundColor: '#c9ffcb' }}
              format="##:##"
              mask="_"
              value={workTimeTemplate?.workTimeStart1}
              autoComplete="off"
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  // onSaveStartTime(event);
                }
              }}
            />
            <NumberFormat
              onBlur={(e) => {
                onChangeEndTime(e.target.value, 'workTimeStart1', 'workTimeEnd1');
              }}
              style={{ marginLeft: '20px', padding: 0, textAlign: 'center', width: '40px', height: '20px', paddingTop: '1px', marginTop: '0px', border: 'none', outline: 'none', fontSize: '10px', paddingBottom: '1px', backgroundColor: '#c9ffcb' }}
              format="##:##"
              mask="_"
              value={workTimeTemplate?.workTimeEnd1}
              autoComplete="off"
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  // onSaveStartTime(event);
                }
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginRight: '20px' }}>
            <label>
              <input
                defaultChecked={workTimeTemplate.active2}
                checked={workTimeTemplate.active2}
                type="checkbox"
                onChange={(event) => {
                  dispatch(setWorkTimeTemplate({ ...workTimeTemplate, active2: event.target.checked }));
                }}
              />
              <span></span>
            </label>
            <div style={{ whiteSpace: 'nowrap' }}>Рабочий день 2 смена:</div>
            <NumberFormat
              onBlur={(e) => {
                onChangeStartTime(e.target.value, 'workTimeStart2', 'workTimeEnd2');
              }}
              style={{ marginLeft: '20px', padding: 0, textAlign: 'center', width: '40px', height: '20px', paddingTop: '1px', marginTop: '0px', border: 'none', outline: 'none', fontSize: '10px', paddingBottom: '1px', backgroundColor: '#c9ffcb' }}
              format="##:##"
              mask="_"
              value={workTimeTemplate?.workTimeStart2}
              autoComplete="off"
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  // onSaveStartTime(event);
                }
              }}
            />
            <NumberFormat
              onBlur={(e) => {
                onChangeEndTime(e.target.value, 'workTimeStart2', 'workTimeEnd2');
              }}
              style={{ marginLeft: '20px', padding: 0, textAlign: 'center', width: '40px', height: '20px', paddingTop: '1px', marginTop: '0px', border: 'none', outline: 'none', fontSize: '10px', paddingBottom: '1px', backgroundColor: '#c9ffcb' }}
              format="##:##"
              mask="_"
              value={workTimeTemplate?.workTimeEnd2}
              autoComplete="off"
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  // onSaveStartTime(event);
                }
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginRight: '20px' }}>
            <label>
              <input
                defaultChecked={workTimeTemplate.active3}
                checked={workTimeTemplate.active3}
                type="checkbox"
                onChange={(event) => {
                  dispatch(setWorkTimeTemplate({ ...workTimeTemplate, active3: event.target.checked }));
                }}
              />
              <span></span>
            </label>
            <div style={{ whiteSpace: 'nowrap' }}>Рабочий день 3 смена:</div>
            <NumberFormat
              onBlur={(e) => {
                onChangeStartTime(e.target.value, 'workTimeStart3', 'workTimeEnd3');
              }}
              style={{ marginLeft: '20px', padding: 0, textAlign: 'center', width: '40px', height: '20px', paddingTop: '1px', marginTop: '0px', border: 'none', outline: 'none', fontSize: '10px', paddingBottom: '1px', backgroundColor: '#c9ffcb' }}
              format="##:##"
              mask="_"
              value={workTimeTemplate?.workTimeStart3}
              autoComplete="off"
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  // onSaveStartTime(event);
                }
              }}
            />
            <NumberFormat
              onBlur={(e) => {
                onChangeEndTime(e.target.value, 'workTimeStart3', 'workTimeEnd3');
              }}
              style={{ marginLeft: '20px', padding: 0, textAlign: 'center', width: '40px', height: '20px', paddingTop: '1px', marginTop: '0px', border: 'none', outline: 'none', fontSize: '10px', paddingBottom: '1px', backgroundColor: '#c9ffcb' }}
              format="##:##"
              mask="_"
              value={workTimeTemplate?.workTimeEnd3}
              autoComplete="off"
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  // onSaveStartTime(event);
                }
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginRight: '20px' }}>
            <label>
              <input
                defaultChecked={workTimeTemplate.active4}
                checked={workTimeTemplate.active4}
                type="checkbox"
                onChange={(event) => {
                  dispatch(setWorkTimeTemplate({ ...workTimeTemplate, active4: event.target.checked }));
                }}
              />
              <span></span>
            </label>
            <div style={{ whiteSpace: 'nowrap' }}>Рабочий день магазина:</div>
            <NumberFormat
              onBlur={(e) => {
                onChangeStartTime(e.target.value, 'workTimeStart4', 'workTimeEnd4');
              }}
              style={{ marginLeft: '20px', padding: 0, textAlign: 'center', width: '40px', height: '20px', paddingTop: '1px', marginTop: '0px', border: 'none', outline: 'none', fontSize: '10px', paddingBottom: '1px', backgroundColor: '#c9ffcb' }}
              format="##:##"
              mask="_"
              value={workTimeTemplate?.workTimeStart4}
              autoComplete="off"
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  // onSaveStartTime(event);
                }
              }}
            />
            <NumberFormat
              onBlur={(e) => {
                onChangeEndTime(e.target.value, 'workTimeStart4', 'workTimeEnd4');
              }}
              style={{ marginLeft: '20px', padding: 0, textAlign: 'center', width: '40px', height: '20px', paddingTop: '1px', marginTop: '0px', border: 'none', outline: 'none', fontSize: '10px', paddingBottom: '1px', backgroundColor: '#c9ffcb' }}
              format="##:##"
              mask="_"
              value={workTimeTemplate?.workTimeEnd4}
              autoComplete="off"
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  // onSaveStartTime(event);
                }
              }}
            />
          </div>
        </div>
      )}
      <div onMouseMove={touchMouseMove} onMouseUp={touchMouseUp} onMouseLeave={touchMouseLeave} ref={refTableWrap} onMouseDown={touchMouseDown} class={clsx((upsertWorkCalendarLoading || loadingEmployees || getEmployeeHiddenLoading) && 'work-calendar-full-grid-loading', 'work-calendar-full-wrap')}>
        <table ref={tableRef} className={clsx('work-calendar-full-grid')}>
          <tr style={{ position: 'sticky', top: 0, left: 0, zIndex: 110 }}>
            <td colSpan="2" width="200" className="work-calendar-full-cell-small-wrap " style={{ position: 'sticky', left: '0px', zIndex: 2 }}>
              <div>
                <SelectMonth
                  isEdited={isEdited}
                  currentMonth={activeMonthYear}
                  onNextMonth={() => {
                    setIsEdited(false);
                    dispatch(setActiveMonthYear(moment(activeMonthYear).add(1, 'months').toString()));
                    dispatch(
                      getAcceptWorkTableSingle({
                        date: moment(activeMonthYear).add(1, 'months').format('YYYY-MM-DD').toString(),
                        subdivisionId: activeCalendarSubdivision?.id,
                      }),
                    );
                  }}
                  onPrevMonth={() => {
                    setIsEdited(false);
                    dispatch(setActiveMonthYear(moment(activeMonthYear).subtract(1, 'months').toString()));
                    dispatch(
                      getAcceptWorkTableSingle({
                        date: moment(activeMonthYear).subtract(1, 'months').format('YYYY-MM-DD').toString(),
                        subdivisionId: activeCalendarSubdivision?.id,
                      }),
                    );
                  }}
                />
              </div>
            </td>
            {allDays?.map((day, dayIndex) => {
              const numberDayOfWeek = day?.getDay();
              return (
                <td
                  width="75"
                  style={{ width: '75px' }}
                  className="work-calendar-full-cell-small-wrap "
                  onClick={() => {
                    setSelectedColumn(dayIndex);
                  }}>
                  <div className={`work-calendar-full-day-of-week ${(numberDayOfWeek === 6 || numberDayOfWeek === 0) && 'work-calendar-full-day-of-week--red cell-day-vs'} ${numberDayOfWeek === 6 ? 'cell-day-sb' : numberDayOfWeek === 0 ? 'cell-day-vs' : ''}`}>{getDayOfWeek(numberDayOfWeek)}</div>
                </td>
              );
            })}
            <td width="120" colSpan="4" className="work-calendar-full-cell-small-wrap sticky-right-td" style={{ textTransform: 'uppercase', position: 'sticky', right: 0, zIndex: 2 }}>
              Итого
            </td>
          </tr>
          <tr style={{ position: 'sticky', top: '23.2px', left: 0, zIndex: 110 }}>
            <td width="150" class="work-calendar-full-cell-small-wrap work-calendar-full-cell-bold" style={{ position: 'sticky', left: '0px', zIndex: 2 }}>
              ФИО
            </td>
            <td width="150" class="work-calendar-full-cell-small-wrap work-calendar-full-cell-bold" style={{ position: 'sticky', left: '100px', zIndex: 2 }}>
              Должность
            </td>
            {allDays?.map((day, dayIndex) => {
              const numberDayOfWeek = day?.getDay();
              return (
                <td
                  width="75"
                  style={{ width: '75px' }}
                  className={`work-calendar-full-cell-small-wrap work-calendar-full-day-of-week `}
                  onClick={() => {
                    setSelectedColumn(dayIndex);
                  }}>
                  <div class={(numberDayOfWeek === 6 || numberDayOfWeek === 0) && 'work-calendar-full-day-of-week--red ' + (numberDayOfWeek === 6 ? 'cell-day-sb' : numberDayOfWeek === 0 ? 'cell-day-vs' : '')}>{moment(day).format('D').toString()}</div>
                </td>
              );
            })}
            <td width="30" className="work-calendar-full-cell-small-wrap sticky-right-td" style={{ position: 'sticky', right: '90px', zIndex: 2, fontWeight: 600 }}>
              Часы
            </td>{' '}
            <td width="30" className="work-calendar-full-cell-small-wrap " style={{ position: 'sticky', right: '60px', zIndex: 2, width: '30px', fontWeight: 600 }}>
              Вых
            </td>{' '}
            <td width="30" className="work-calendar-full-cell-small-wrap " style={{ position: 'sticky', right: '30px', zIndex: 2, fontWeight: 600 }}>
              Отп
            </td>
            <td width="30" className="work-calendar-full-cell-small-wrap " style={{ position: 'sticky', right: '0px', zIndex: 2, fontWeight: 600 }}>
              Бол
            </td>
          </tr>
          {[...fields]
            .sort(function (a, b) {
              return a.groupPost - b.groupPost;
            })
            ?.map((item, index) => {
              return (
                <WorkCalendarFullRow
                  key={item?.userId}
                  showHiddenList={showHiddenEmployees}
                  onShowHiddenList={() => {
                    setShowHiddenEmployees(true);
                  }}
                  dayList={allDays}
                  onLastCountWork={allDays?.map((itemDayInner, dayIndex) => {
                    return countWorkers(watchCalendar, dayIndex, fields[index - 1]?.groupPost);
                  })}
                  onLastCountWorkLast={allDays?.map((itemDayInner, dayIndex) => {
                    return countWorkers(watchCalendar, dayIndex, fields[index]?.groupPost);
                  })}
                  lastIndex={fields?.length}
                  lastPostRow={item.isLastPost}
                  resetSelectedColumn={() => {
                    setSelectedColumn(-1);
                  }}
                  selectedColumn={selectedColumn}
                  timeTableRow={item?.timeTable}
                  isAccessEdit={isAccessEditCalendar()}
                  setIsEdited={setIsEdited}
                  item={item}
                  index={index}
                  control={control}
                  realIndex={fields?.findIndex((findItem) => findItem?.userId == item?.userId)}
                  update={update}
                  firstItemGroupIndex={fields?.findIndex((findItem) => findItem?.groupPost == item?.groupPost)}
                  firstItemGroup={fields?.find((findItem) => findItem?.groupPost == item?.groupPost)}
                  getValues={getValues}
                />
              );
            })}
          <tr class="work-calendar-row-top" style={{ position: 'sticky', bottom: '43.9px', left: 0, zIndex: 110, borderTop: '1px solid #b7b7b7', backgroundColor: '#fff' }}>
            <td colSpan="2" class="work-calendar-full-cell-small-wrap" style={{ padding: '0 10px', textAlign: 'left', position: 'sticky', left: '0px', zIndex: 2, backgroundColor: '#fff' }}>
              Кол-во сотрудников в смену
            </td>
            {totalCountWorkers?.map((item, itemIndex) => (
              <td class={clsx('work-calendar-full-cell-no-border work-calendar-full-cell-small-wrap work', allDays[itemIndex]?.getDay() === 6 ? 'cell-day-sb' : allDays[itemIndex]?.getDay() === 0 ? 'cell-day-vs' : '')}>{item}</td>
            ))}
            <td colSpan="4" style={{ textAlign: 'center', padding: 0, textTransform: 'uppercase', position: 'sticky', right: 0, zIndex: 2 }} class="work-calendar-full-cell-small-wrap sticky-right-td">
              {totalCountWorkers.reduce((partialSum, a) => partialSum + a, 0)}
            </td>
          </tr>
          <tr style={{ position: 'sticky', bottom: '21.2px', left: 0, zIndex: 110, backgroundColor: '#fff' }}>
            <td colSpan="2" class="work-calendar-full-cell-small-wrap work-calendar-row-top" style={{ padding: '0 10px', textAlign: 'left', position: 'sticky', left: '0px', zIndex: 2, backgroundColor: '#fff' }}>
              Кол-во сотрудников с открытие
            </td>
            {totalCountMinStartTimeWorkers?.map((item2, item2Index) => (
              <td class={clsx('work-calendar-full-cell-no-border work-calendar-full-cell-small-wrap work', allDays[item2Index]?.getDay() === 6 ? 'cell-day-sb' : allDays[item2Index]?.getDay() === 0 ? 'cell-day-vs' : '')}> {item2}</td>
            ))}
            <td colSpan="4" style={{ textAlign: 'center', padding: 0, position: 'sticky', right: 0, zIndex: 2 }} class="work-calendar-full-cell-small-wrap sticky-right-td">
              {totalCountMinStartTimeWorkers.reduce((partialSum, a) => partialSum + a, 0)}
            </td>
          </tr>
          <tr style={{ position: 'sticky', bottom: '-0.1px', left: 0, zIndex: 110, backgroundColor: '#fff' }}>
            <td colSpan="2" class=" work-calendar-full-cell-small-wrap" style={{ padding: '0 10px', textAlign: 'left', position: 'sticky', left: '0px', zIndex: 2, backgroundColor: '#fff' }}>
              Кол-во сотрудников с закрытие
            </td>
            {totalCountMinEndTimeWorkers?.map((item3, item3Index) => (
              <td class={clsx('work-calendar-full-cell-no-border work-calendar-full-cell-small-wrap work', allDays[item3Index]?.getDay() === 6 ? 'cell-day-sb' : allDays[item3Index]?.getDay() === 0 ? 'cell-day-vs' : '')}>{item3}</td>
            ))}
            <td colSpan="4" style={{ textAlign: 'center', padding: 0, position: 'sticky', right: 0, zIndex: 2 }} class="work-calendar-full-cell-small-wrap sticky-right-td">
              {totalCountMinEndTimeWorkers.reduce((partialSum, a) => partialSum + a, 0)}
            </td>
          </tr>
        </table>
      </div>

      {/* <div style={{ display: 'flex', marginTop: '50px', justifyContent: 'space-between', alignItems: 'center', maxWidth: 'min-content' }}>
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
      </div> */}
      {/* <TimeTableFull /> */}
    </div>
  );
};

export default WorkCalendarFull;
