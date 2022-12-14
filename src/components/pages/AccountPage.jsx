import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Navigate } from 'react-router';
import clsx from 'clsx';
import { Controller, useForm } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import moment from 'moment/moment';
import { getAccount } from '../../redux/actions/employee/getAccount.action';
import CalendarFilter from '../CalendarFilter';
import { getEmployees } from '../../redux/actions/employee/getEmployees.action';
import WorkCalendar from '../WorkCalendar';
import WorkCalendarFull from '../WorkCalendarFull';
import { setShowFullCalendar } from '../../redux/slices/workCalendar.slice';
import { resetGetEmployees } from '../../redux/slices/employee.slice';
import { convertMinsToHrsMins } from '../calendarFull/WorkCalendarFullRow';
import ModalAcceptTable from '../modals/ModalAcceptTable';
import { getWorkCalendarMonth } from '../../redux/actions/workCalendar/getWorkCalendarMonth.slice';
import { getEmployeeHistory } from '../../redux/actions/employeeHistory/getEmployeeHistory.action';
import { setActiveCalendarSubdivision } from '../../redux/slices/employeeHistory.slice';
import PlanTab from '../PlanTab';
const AccountPage = () => {
  const defaultValues = { date: new Date() };
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
    getValues,
    setError,
    clearErrors,
  } = useForm({ defaultValues });
  const {
    auth: { role, editorWorkTable },
  } = useSelector((state) => state.app);
  const {
    getAccount: { data: dataAccount, loading: loadingAccount, error: errorAccount },
    getEmployeeUser: { data: dataUser, loading: loadingUser, error: errorUser },
    getEmployees: { data: employees, loading: loadingEmployees, error: errorEmployees },
  } = useSelector((state) => state.employee);

  const {
    activeMonthYear,
    getWorkCalendarMonth: { data: workCalendarData, loading: workCalendarMonthLoading },
    showFullCalendar,
  } = useSelector((state) => state.workCalendar);

  const {
    getEmployeeHistory: { data: employeeHistory },
    activeCalendarSubdivision,
  } = useSelector((state) => state.employeeHistory);
  const handleClickOpenFullCalendar = () => {
    const paramsEmployees = { page: 0, search: '', subdivision: activeCalendarSubdivision?.id, dateCalendar: activeMonthYear };
    dispatch(getEmployees(paramsEmployees));
  };
  useEffect(() => {
    if (employees?.length >= 1) {
      dispatch(setShowFullCalendar(true));
    }
  }, [employees]);

  const dateWatch = watch('date');
  const onBlurDate = () => {
    const isValidDate = moment(getValues('date')).isValid();
    if (!isValidDate) {
      setValue('date', moment().format('DD.MM.YYYY'));
    }
  };
  const dispatch = useDispatch();
  const [showAccept, setShowAccept] = useState(false);
  const {
    getEmployeeUser: { data: employee },
  } = useSelector((state) => state.employee);

  const onSubmit = (data) => {
    dispatch(getAccount({ idService: employee?.idService, date: moment(data?.date).format('YYYY-MM-DD') }));
  };
  useEffect(() => {
    if (employeeHistory && dataUser) {
      const findCurrentSubdiv = employeeHistory?.find((historyItem) => historyItem?.id === dataUser?.postSubdivision?.subdivisionId);
      if (findCurrentSubdiv) {
        dispatch(setActiveCalendarSubdivision(findCurrentSubdiv));
      }
    }
  }, [employeeHistory, dataUser]);

  // return errorAccount ? (
  //   <Navigate to={'/'} />
  // ) : (
  //  (
  //   dataAccount && (
  // const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState('balance-tab');
  const [showDateFilter, setShowDateFilter] = useState(false);
  useEffect(() => {
    if (showFullCalendar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showFullCalendar]);
  const isAccessEditCalendar = () => {
    return dataUser?.subdivisions?.find((subdivFind) => subdivFind?.id == activeCalendarSubdivision?.id) || dataUser?.postSubdivision?.postId === 1;
  };
  useEffect(() => {
    dispatch(getEmployeeHistory());
  }, []);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div class="tab">
          <button
            onClick={() => {
              setActiveTab('balance-tab');
            }}
            class={`filter__item tablinks ${activeTab === 'balance-tab' && 'active'}`}>
            ????????????
          </button>
        </div>
        <div class="tab">
          <button
            onClick={() => {
              setActiveTab('plan-tab');
            }}
            class={`filter__item tablinks ${activeTab === 'plan-tab' && 'active'}`}>
            ????????????????
          </button>
        </div>
        <div class="tab">
          <button
            onClick={() => {
              setActiveTab('graphic-tab');
            }}
            class={`filter__item tablinks ${activeTab === 'graphic-tab' && 'active'}`}>
            ????????????
          </button>
        </div>
      </div>
      {activeTab == 'balance-tab' ? (
        <div class="tabcontent">
          <div class="wrap__day">
            <div className="table__common">
              <div className="table__common-item">
                <div className="table_common-left">????????????:&nbsp;</div>
                <div className="table_common-right">{dataAccount?.balance || 0}</div>
              </div>
              <div className="table__common-item">
                <div className="table_common-left">???????? :&nbsp;</div>
                <div className="table_common-right">{dataAccount?.hours || 0}</div>
              </div>
              <div className="table__common-item">
                <div className="table_common-left">?? ???????????? ???????????? :&nbsp;</div>
                <div className="table_common-right">{dataAccount?.earned || 0}</div>
              </div>
            </div>
            <div class="blocks__item report " style={{ marginBottom: 0 }}>
              <div className="date" style={{ gridGap: '0px', gridTemplateColumns: 'auto auto auto' }}>
                <div className="date__wrap" style={{ marginRight: '20px', position: 'relative' }}>
                  {/* <Controller
                  control={control}
                  name={'date'}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, name, value } }) => (
                    <NumberFormat
                      style={{ marginBottom: 0, width: '100px' }}
                      format="##.##.####"
                      mask="_"
                      name={name}
                      value={moment(value).format('DD.MM.YYYY')}
                      placeholder={'01.01.2022'}
                      onValueChange={() => {}}
                      onClick={() => {
                        setShowDateFilter(!showDateFilter);
                      }}
                      onChange={() => {}}
                      autoComplete="off"
                    />
                  )}
                /> */}
                  <input
                    type="text"
                    style={{ marginBottom: 0, width: '100px', userSelect: 'none', caretColor: 'transparent', cursor: 'pointer' }}
                    value={moment(dateWatch).format('DD.MM.YYYY')}
                    onClick={() => {
                      if (showDateFilter) {
                        setShowDateFilter(false);
                      } else {
                        setShowDateFilter(true);
                      }
                    }}
                  />
                  {/* <NumberFormat
                  style={{ marginBottom: 0, width: '100px', userSelect: 'none' }}
                  format="##.##.####"
                  mask="_"
                  // name={name}
                  value={moment(dateWatch).format('DD.MM.YYYY')}
                  placeholder={'01.01.2022'}
                  onValueChange={() => {
                    setValue(moment(dateWatch).format('DD.MM.YYYY'));
                  }}
                 
                  onChange={() => {
                    setValue(moment(dateWatch).format('DD.MM.YYYY'));
                  }}
                  autoComplete="off"
                /> */}
                  {showDateFilter && (
                    <CalendarFilter
                      setDate={(dateNews) => {
                        setValue('date', dateNews);
                      }}
                      date={dateWatch}
                      onClose={() => setShowDateFilter(false)}
                    />
                  )}
                </div>{' '}
                {loadingAccount ? (
                  <div className="loading-account">???????? ????????????????...</div>
                ) : (
                  <>
                    <button class="report__btn" onClick={handleSubmit(onSubmit)}>
                      ???????????????????????? ?????????? ?? ????????????
                    </button>

                    {dataAccount?.table && dataAccount?.table?.length > 0 && (
                      <div class="report__total">
                        ??????????: <b>{dataAccount?.table?.map((row) => (parseFloat(row?.ranc) + parseFloat(row?.turn) + parseFloat(row?.margin)).toFixed(2)).reduce((partialSum, a) => (parseFloat(partialSum) + parseFloat(a)).toFixed(2), 0)}</b>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            {dataAccount?.table && dataAccount?.table?.length > 0 && !loadingAccount ? (
              <div className="table-common">
                <div className="table-common__head">????????</div>
                <div className="table-common__head">????????????????????????</div>
                <div className="table-common__head">??????-????</div>
                <div className="table-common__head">??????????</div>
                {dataAccount?.table?.map((row) => (
                  <>
                    <div className="table-common__cell">{moment(row?.date_sale).format('DD.MM.YYYY')}</div>
                    <div className="table-common__cell">{row?.product}</div>
                    <div className="table-common__cell">{row?.quantity}</div>
                    <div className="table-common__cell">{(parseFloat(row?.ranc) + parseFloat(row?.turn) + parseFloat(row?.margin)).toFixed(2)}</div>
                  </>
                ))}
              </div>
            ) : (!dataAccount?.table || dataAccount?.table?.length === 0) && !loadingAccount ? (
              <div style={{ margin: '40px auto 0 auto', textAlign: 'center', color: '#ff0d0d', display: 'flex', justifyContent: 'left', marginBottom: '60px' }}>???? ???????????????? ???????? ???????????? ??????. ???????????????????? ?????????????? ?????????????? ????????, ?????? ???????? ??????????????</div>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : activeTab == 'plan-tab' ? (
        <PlanTab />
      ) : (
        <div class="tabcontent">
          {
            <>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div class="modal__select">
                  <select
                    style={{ width: '218px' }}
                    onChange={(event) => {
                      if (event.target.value) {
                        const findCurrentSubdiv = employeeHistory?.find((historyItem) => historyItem?.id == event.target.value);
                        const findAccessSubdiv = dataUser?.subdivisions?.find((accessSubdiv) => accessSubdiv?.id == event.target.value);
                        if (findCurrentSubdiv) {
                          dispatch(setActiveCalendarSubdivision(findCurrentSubdiv));
                        } else if (findAccessSubdiv) {
                          dispatch(setActiveCalendarSubdivision({ id: findAccessSubdiv?.id, name: findAccessSubdiv?.name }));
                        }
                      }
                    }}>
                    {employeeHistory.map((value) => {
                      return (
                        <option selected={value?.id === activeCalendarSubdivision?.id} value={value?.id}>
                          {value?.name}
                        </option>
                      );
                    })}
                    {dataUser?.subdivisions?.map((itemSubdiv) => {
                      const findRepeat = employeeHistory?.find((emplHist) => emplHist.id == itemSubdiv?.id);
                      if (!findRepeat) {
                        return (
                          <option selected={itemSubdiv?.id === activeCalendarSubdivision?.id} value={itemSubdiv?.id}>
                            {itemSubdiv?.name}
                          </option>
                        );
                      }
                    })}
                  </select>
                </div>
                <div style={{ padding: '15px 20px', marginBottom: '20px', background: '#fff', marginLeft: '20px' }}>
                  ?????????????? ????????:&nbsp;{' '}
                  <b>
                    {convertMinsToHrsMins(
                      workCalendarData?.workCalendars
                        ?.map((item1) => {
                          return moment(item1?.endTime).set('seconds', 0).diff(moment(item1?.startTime).set('seconds', 0), 'minutes');
                        })
                        .reduce((partialSum, a) => partialSum + a, 0),
                    )}
                  </b>
                </div>
                {
                  <button onClick={handleClickOpenFullCalendar} class="report__btn" style={{ marginBottom: '20px', marginLeft: '20px' }}>
                    {loadingEmployees ? <div className="loading-account">???????? ????????????????...</div> : isAccessEditCalendar() ? '??????????????????????????' : '??????????????????????'}
                  </button>
                }
              </div>

              <WorkCalendar />
              {showFullCalendar && (
                <WorkCalendarFull
                  onOpenAccept={() => {
                    setShowAccept(true);
                  }}
                  onClose={(isEdited) => {
                    if (isEdited) {
                      setShowAccept(true);
                    } else {
                      dispatch(setShowFullCalendar(false));
                      dispatch(resetGetEmployees());
                      dispatch(getWorkCalendarMonth({ date: moment(activeMonthYear).format('YYYY-MM-DD').toString(), subdivision: activeCalendarSubdivision?.id }));
                    }
                  }}
                />
              )}
              {showAccept && (
                <ModalAcceptTable
                  onClose={() => {
                    setShowAccept(false);
                  }}
                  onSave={() => {
                    setShowAccept(false);
                    dispatch(setShowFullCalendar(false));
                    dispatch(resetGetEmployees());
                    dispatch(getWorkCalendarMonth({ date: moment(activeMonthYear).format('YYYY-MM-DD').toString(), subdivision: activeCalendarSubdivision?.id }));
                  }}
                />
              )}
            </>
          }
        </div>
      )}
    </>
  );
  //   )
  // );
  // );
};

export default AccountPage;
