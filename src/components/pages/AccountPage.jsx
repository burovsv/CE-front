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
import { resetGetEmployees, resetPrePaymentCreate } from '../../redux/slices/employee.slice';
import { convertMinsToHrsMins } from '../calendarFull/WorkCalendarFullRow';
import ModalAcceptTable from '../modals/ModalAcceptTable';
import { getWorkCalendarMonth } from '../../redux/actions/workCalendar/getWorkCalendarMonth.slice';
import { getEmployeeHistory } from '../../redux/actions/employeeHistory/getEmployeeHistory.action';
import { setActiveCalendarSubdivision } from '../../redux/slices/employeeHistory.slice';
import PlanTab from '../PlanTab';
import { getAccountList } from '../../redux/actions/employee/getAccountList.action';
import { getEmployeeAccess } from '../../redux/actions/employee/getEmployeesAccess.action';
import ModalPrePayment from '../modals/ModalPrePayment';
import { prePaymentCreate } from '../../redux/actions/employee/prePaymentCreate.action';
import ModalThank from '../modals/ModalThank';
import Modal from '../modals/Modal';
import PrePaymentList from '../PrePaymentList';
import { getSubdivisionWorkTimeTemplates } from '../../redux/actions/subdivision/getSubdivisionWorkTimeTemplates.action';
import { resetGetSubdivisionWorkTimeTemplates } from '../../redux/slices/subdivision.slice';
import { getCashBoxList } from '../../redux/actions/employee/getCashBoxList.action';
import { getPrePaymentSettings } from '../../redux/actions/employee/getPrePaymentSettings.action';
import { getSubdivisions } from '../../redux/actions/subdivision/getSubdivisions.action';
import { currencyFormat } from '../../utils/currencyFormat';
import StaffList from '../StaffList';
import AcceptedList from '../AcceptedList';
import { getAcceptWorkTable } from '../../redux/actions/workCalendar/getAcceptWorkTable.slice';
import { getAcceptWorkTableSingle } from '../../redux/actions/workCalendar/getAcceptWorkTableSingle.slice';
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
    getAccountList: { data: dataAccountList, loading: loadingAccountList, error: errorAccountList },
    getEmployeeUser: { data: dataUser, loading: loadingUser, error: errorUser },
    getEmployees: { data: employees, loading: loadingEmployees, error: errorEmployees },
    prePaymentCreate: { data: prePaymentCreateData, loading: prePaymentLoading, error: prePaymentCreateError },
    getCashBoxList: { data: getCashBoxListData },
    getPrePaymentSettings: { data: prePaymentSettings },
  } = useSelector((state) => state.employee);
  const {
    getSubdivisions: { data: subdivisions, loading: subdivisionsLoading },
  } = useSelector((state) => state.subdivision);
  const [childActiveTab, setChildActiveTab] = useState('balance-list-tab');
  const [isManager, setIsManager] = useState(false);
  const [selectedAccessSubdivision, setSelectedAccessSubdivision] = useState(null);
  const [isAggrement, setIsAggrement] = useState(false);
  const [comment, setComment] = useState('');
  const [listAccessSubdivision, setListAccessSubdivision] = useState([]);
  const {
    activeMonthYear,
    getWorkCalendarMonth: { data: workCalendarData, loading: workCalendarMonthLoading },
    showFullCalendar,
  } = useSelector((state) => state.workCalendar);
  const [showPrePayment, setShowPrePayment] = useState(false);
  const {
    getEmployeeHistory: { data: employeeHistory },
    activeCalendarSubdivision,
  } = useSelector((state) => state.employeeHistory);
  const [clickEditWorkTable, setClickEditWorkTable] = useState(false);
  const handleClickOpenFullCalendar = () => {
    const paramsEmployees = { page: 0, search: '', subdivision: activeCalendarSubdivision?.id, dateCalendar: moment(activeMonthYear).format('YYYY-MM-DD').toString() };
    dispatch(getSubdivisionWorkTimeTemplates(activeCalendarSubdivision?.id));
    dispatch(getEmployees(paramsEmployees));
    if (!(dataUser?.postSubdivision?.postId == process.env.REACT_APP_DIRECTOR_POST_ID || dataUser?.id == 166)) {
      dispatch(
        getAcceptWorkTableSingle({
          date: moment(activeMonthYear).format('YYYY-MM-DD').toString(),
          subdivisionId: activeCalendarSubdivision?.id,
        }),
      );
    }

    setClickEditWorkTable(true);
  };
  useEffect(() => {
    if (employees?.length >= 1 && clickEditWorkTable) {
      dispatch(setShowFullCalendar(true));
      setClickEditWorkTable(false);
    }
  }, [employees, clickEditWorkTable]);
  const [activeTab, setActiveTab] = useState('balance-tab');
  const [activeSubTab, setActiveSubTab] = useState('graphic-subtab');
  useEffect(() => {
    if ((dataUser?.postSubdivision?.postId == process.env.REACT_APP_DIRECTOR_POST_ID || dataUser?.id == 166) && activeMonthYear && dataUser && activeSubTab === 'graphic-subtab' && activeTab === 'graphic-tab') {
      dispatch(getAcceptWorkTable({ date: moment(activeMonthYear).format('YYYY-MM-DD').toString() }));
    }
  }, [activeMonthYear, dataUser, activeTab, activeSubTab]);

  const [showSuccessPrePayment, setShowSuccessPrePayment] = useState(false);
  const [prePaymentEmployee, setPrePaymentEmployee] = useState({});
  console.log(prePaymentEmployee);
  const [showErrorPrePayment, setShowErrorPrePayment] = useState(false);
  useEffect(() => {
    if (prePaymentCreateData && !prePaymentCreateError) {
      window.location.reload(false);
      setShowPrePayment(false);
      setShowSuccessPrePayment(true);
      setPrePaymentEmployee({});
      setComment('');
      setTimeout(() => {
        setShowSuccessPrePayment(false);
      }, 2000);
      dispatch(resetPrePaymentCreate());
    } else if (!prePaymentCreateData && prePaymentCreateError) {
      setShowPrePayment(false);
      setShowErrorPrePayment(true);
      setPrePaymentEmployee({});
      setTimeout(() => {
        setShowErrorPrePayment(false);
      }, 2000);
      dispatch(resetPrePaymentCreate());
    }
  }, [prePaymentCreateData, prePaymentCreateError]);

  const dateWatch = watch('date');
  const onBlurDate = () => {
    const isValidDate = moment(getValues('date')).isValid();
    if (!isValidDate) {
      setValue('date', moment().format('DD.MM.YYYY'));
    }
  };
  const dispatch = useDispatch();
  const [showAccept, setShowAccept] = useState(false);
  const [selectedEmployeeAccount, setSelectedEmployeeAccount] = useState(null);
  const [employeeAccountMoveBalance, setEmployeeAccountMoveBalance] = useState(false);
  const [employeeAccountMoveBalanceName, setEmployeeAccountMoveBalanceName] = useState('');
  const {
    getEmployeeUser: { data: employee },
  } = useSelector((state) => state.employee);
  useEffect(() => {
    if (dataUser && subdivisions) {
      setIsManager(dataUser?.postSubdivision?.postId == process.env.REACT_APP_SELLER_ID || dataUser?.postSubdivision?.postId == process.env.REACT_APP_DIRECTOR_POST_ID || dataUser?.id == 166);
      const selfSubdivision = { value: dataUser?.postSubdivision?.subdivisionId, label: dataUser?.subdivision, id: dataUser?.subdivisionIdService };
      let listSubdivisionData = [selfSubdivision];
      // if (dataUser?.postSubdivision?.postId == process.env.REACT_APP_DIRECTOR_POST_ID || dataUser?.id == 166) {
      //   [...subdivisions]
      //     .sort(function (a, b) {
      //       return a?.name.localeCompare(b?.name);
      //     })
      //     ?.map((sudivItem) => {
      //       if (sudivItem?.id != selfSubdivision?.value && sudivItem?.id != 1) {
      //         listSubdivisionData.push({ label: sudivItem?.name, value: sudivItem?.id, id: sudivItem?.idService });
      //       }
      //     });
      // } else {
      [...dataUser?.accessBalance]
        .sort(function (a, b) {
          return a?.name.localeCompare(b?.name);
        })
        ?.map((itemAccess) => {
          if (itemAccess?.subdivisionId != selfSubdivision?.value) {
            listSubdivisionData.push({ label: itemAccess?.name, value: itemAccess?.subdivisionId, id: itemAccess?.idService });
          }
        });
      // }

      setListAccessSubdivision(listSubdivisionData);
      setSelectedAccessSubdivision(selfSubdivision);
    }
  }, [dataUser, subdivisions, activeSubTab, activeTab]);

  const onSubmit = (data) => {
    dispatch(getAccount({ idService: isManager ? selectedEmployeeAccount : employee?.idService, date: moment(data?.date).format('YYYY-MM-DD') }));
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

  const [showDateFilter, setShowDateFilter] = useState(false);

  // useEffect(() => {
  //   if (activeTab == 'balance-tab') {
  //     dispatch(getEmployeeAccess('balance'));
  //   }
  // }, [activeTab]);

  useEffect(() => {
    if (showFullCalendar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showFullCalendar]);
  const isAccessEditCalendar = () => {
    return dataUser?.subdivisions?.find((subdivFind) => subdivFind?.id == activeCalendarSubdivision?.id) || dataUser?.postSubdivision?.postId === 1;
    // return true;
  };
  useEffect(() => {
    dispatch(getEmployeeHistory());
    dispatch(getSubdivisions());
    dispatch(getPrePaymentSettings());
  }, []);
  const [activeCashBox, setActiveCashBox] = useState(null);
  useEffect(() => {
    if (isManager && listAccessSubdivision?.length >= 1 && selectedAccessSubdivision) {
      setActiveCashBox(null);
      dispatch(getAccountList(selectedAccessSubdivision?.value));
      dispatch(getCashBoxList(selectedAccessSubdivision?.value));
    }
  }, [isManager, selectedAccessSubdivision, listAccessSubdivision]);

  useEffect(() => {
    if (isManager && selectedEmployeeAccount) {
      dispatch(getAccount({ idService: selectedEmployeeAccount, date: moment().format('YYYY-MM-DD') }));
    }
  }, [selectedEmployeeAccount]);

  useEffect(() => {
    if (getCashBoxListData && getCashBoxListData?.length !== 0) {
      setActiveCashBox(getCashBoxListData[0]);
    }
  }, [getCashBoxListData]);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div class="tab">
          <button
            onClick={() => {
              setActiveTab('balance-tab');
            }}
            class={`filter__item tablinks ${activeTab === 'balance-tab' && 'active'}`}>
            Баланс
          </button>
        </div>{' '}
        <div class="tab">
          <button
            onClick={() => {
              setActiveTab('plan-tab');
            }}
            class={`filter__item tablinks ${activeTab === 'plan-tab' && 'active'}`}>
            Конкурсы
          </button>
        </div>
        <div class="tab">
          <button
            onClick={() => {
              setActiveTab('graphic-tab');
            }}
            class={`filter__item tablinks ${activeTab === 'graphic-tab' && 'active'}`}>
            График работы
          </button>
        </div>
      </div>
      {activeTab == 'balance-tab' ? (
        <>
          {isManager && (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '-20px' }}>
              <div class="tab">
                <button
                  onClick={() => {
                    setChildActiveTab('balance-list-tab');
                  }}
                  class={`filter__item tablinks ${childActiveTab === 'balance-list-tab' && 'active'}`}>
                  Сотрудники
                </button>
              </div>

              <div class="tab">
                <button
                  onClick={() => {
                    setChildActiveTab('balance-history-tab');
                  }}
                  class={`filter__item tablinks ${childActiveTab === 'balance-history-tab' && 'active'}`}>
                  История
                </button>
              </div>
            </div>
          )}
          {childActiveTab === 'balance-list-tab' && (
            <div class="tabcontent">
              {!selectedEmployeeAccount && isManager ? (
                !loadingAccountList ? (
                  <>
                    <div className="modal__select" style={{ width: '300px' }}>
                      <select
                        onChange={(val) => {
                          if (val.target.value) {
                            setSelectedAccessSubdivision({ value: val.target.value });
                          }
                        }}
                        value={selectedAccessSubdivision?.value || ''}
                        placeholder="Должность">
                        {listAccessSubdivision?.map((item, itemIndex) => {
                          return <option value={item?.value}>{item?.label}</option>;
                        })}
                      </select>
                    </div>
                    {dataAccountList && dataAccountList?.length > 0 ? (
                      <>
                        <div className="table-common table-common-balance" style={{ gridTemplateColumns: '1fr auto auto auto auto auto auto' }}>
                          <div className="table-common__head">Сотрудник</div>
                          <div className="table-common__head">Должность</div>
                          <div className="table-common__head">Часы</div>
                          <div className="table-common__head">
                            Текущий <br /> баланс (без <br /> начисления <br /> за текущий <br /> месяц)
                          </div>
                          <div className="table-common__head">
                            С начала <br />
                            этого <br /> месяца по <br /> вчерашний <br /> день
                          </div>

                          <div className="table-common__head">
                            Итоговый <br /> баланс (с <br /> учетом <br /> начисления)
                          </div>
                          <div className="table-common__head">Аванс</div>
                          {[...dataAccountList]
                            ?.sort((a, b) => a.post.localeCompare(b.post))
                            ?.map((row, indexRow) => (
                              <>
                                <div
                                  onClick={() => {
                                    setSelectedEmployeeAccount(row?.id);
                                  }}
                                  className={`table-common__cell ${indexRow % 2 !== 0 ? 'table-common__cell-odd' : ''}`}
                                  style={{ cursor: 'pointer' }}>
                                  {row?.name}
                                </div>
                                <div
                                  onClick={() => {
                                    setSelectedEmployeeAccount(row?.id);
                                  }}
                                  className={`table-common__cell ${indexRow % 2 !== 0 ? 'table-common__cell-odd' : ''}`}
                                  style={{ cursor: 'pointer' }}>
                                  {row?.post || '-'}
                                </div>
                                <div
                                  onClick={() => {
                                    setSelectedEmployeeAccount(row?.id);
                                  }}
                                  className={`table-common__cell ${indexRow % 2 !== 0 ? 'table-common__cell-odd' : ''}`}
                                  style={{ cursor: 'pointer' }}>
                                  {row?.hours}
                                </div>
                                <div className={`table-common__cell ${indexRow % 2 !== 0 ? 'table-common__cell-odd' : ''}`} style={{ textAlign: 'left', cursor: 'pointer', padding: '10px' }}>
                                  <div
                                    onClick={() => {
                                      setSelectedEmployeeAccount(row?.id);
                                      setEmployeeAccountMoveBalance(true);
                                      setEmployeeAccountMoveBalanceName(row?.name);
                                    }}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      height: '35px',
                                      width: '65px',
                                      padding: '10px',
                                      background: '#feed01',
                                    }}>
                                    {currencyFormat(parseInt(row?.balance) - parseInt(row?.earned))}
                                  </div>
                                </div>
                                <div
                                  onClick={() => {
                                    setSelectedEmployeeAccount(row?.id);
                                  }}
                                  className={`table-common__cell ${indexRow % 2 !== 0 ? 'table-common__cell-odd' : ''}`}
                                  style={{ textAlign: 'left', cursor: 'pointer' }}>
                                  {currencyFormat(parseInt(row?.earned))}
                                </div>

                                <div
                                  onClick={() => {
                                    setSelectedEmployeeAccount(row?.id);
                                  }}
                                  className={`table-common__cell ${indexRow % 2 !== 0 ? 'table-common__cell-odd' : ''}`}
                                  style={{ cursor: 'pointer' }}>
                                  {currencyFormat(parseInt(row?.balance))}
                                </div>
                                <div className={`table-common__cell ${indexRow % 2 !== 0 ? 'table-common__cell-odd' : ''}`} style={{ padding: '5px 14px', display: 'flex', alignItems: 'center' }}>
                                  <input
                                    defaultValue={prePaymentEmployee[row?.userId]?.sum ?? '0'}
                                    value={prePaymentEmployee[row?.userId]?.sum ?? '0'}
                                    onChange={(event) => {
                                      let updatePrePaymentEmployee = { ...prePaymentEmployee };
                                      let valInt = parseInt(event.target.value);
                                      let val = event.target.value;
                                      if (val == '' || val == '-') {
                                        valInt = val;
                                      } else if (isNaN(valInt)) {
                                        valInt = 0;
                                      }
                                      updatePrePaymentEmployee[row?.userId] = { sum: valInt, name: row?.name };

                                      setPrePaymentEmployee(updatePrePaymentEmployee);
                                    }}
                                    onBlur={(event) => {
                                      if (!isAggrement) {
                                        if (event.target.value == '-' || !event.target.value) {
                                          let updatePrePaymentEmployee = { ...prePaymentEmployee };
                                          updatePrePaymentEmployee[row?.userId] = { sum: 0, name: row?.name };
                                          setPrePaymentEmployee(updatePrePaymentEmployee);
                                        } else if (parseInt(row?.balance) > prePaymentSettings.minSum && row?.monthSum < prePaymentSettings.percent) {
                                          let val = parseInt(event.target.value);
                                          let resultSum = parseInt(row?.balance) - prePaymentSettings.minSum;
                                          // let maxSum = 0;
                                          if (resultSum >= prePaymentSettings.percent) {
                                            resultSum = prePaymentSettings.percent;
                                          }

                                          if (val <= prePaymentSettings.percent && val > 0 && val <= prePaymentSettings.percent - parseInt(row?.monthSum) && val <= resultSum) {
                                            let updatePrePaymentEmployee = { ...prePaymentEmployee };
                                            updatePrePaymentEmployee[row?.userId] = { sum: val, name: row?.name };
                                            setPrePaymentEmployee(updatePrePaymentEmployee);
                                          } else {
                                            let updatePrePaymentEmployee = { ...prePaymentEmployee };
                                            updatePrePaymentEmployee[row?.userId] = { sum: 0, name: row?.name };
                                            setPrePaymentEmployee(updatePrePaymentEmployee);
                                          }
                                        }
                                      }
                                    }}
                                    disabled={isAggrement ? (Object.keys(prePaymentEmployee)?.filter((preKey) => prePaymentEmployee[preKey]?.sum && row?.userId != preKey).length >= 1 ? true : false) : parseInt(row?.balance) <= prePaymentSettings.minSum || row?.monthSum >= prePaymentSettings.percent}
                                    type="text"
                                    style={{
                                      height: '35px',
                                      width: '65px',
                                      border: '0.2px solid #C6C6C6',
                                      outline: 'none',
                                      padding: '10px',
                                      boxSizing: 'border-box',
                                      fontFamily: 'inherit',
                                      ...(parseInt(row?.balance) <= prePaymentSettings.minSum && row?.monthSum >= prePaymentSettings.percent && { background: '#F2F2F2' }),
                                      ...(isAggrement &&
                                        !(Object.keys(prePaymentEmployee)?.filter((preKey) => prePaymentEmployee[preKey]?.sum && row?.userId != preKey).length >= 1) && {
                                          background: '#fff',
                                        }),
                                    }}
                                  />
                                </div>
                              </>
                            ))}
                        </div>
                        {prePaymentSettings && (
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                            {getCashBoxListData && (
                              <select
                                style={{ width: '218px', marginBottom: '0', marginRight: '20px' }}
                                onChange={(event) => {
                                  if (event.target.value) {
                                    const findCurrentCashBox = getCashBoxListData?.find((itemCash) => itemCash?.id_cashbox == event.target.value);
                                    if (findCurrentCashBox) {
                                      setActiveCashBox(findCurrentCashBox);
                                    }
                                  }
                                }}>
                                {getCashBoxListData.map((value) => {
                                  return (
                                    <option selected={value?.id_cashbox == activeCashBox?.id_cashbox} value={value?.id_cashbox}>
                                      {value?.name_cashbox}
                                    </option>
                                  );
                                })}
                              </select>
                            )}

                            <div
                              onClick={() => {
                                const isActive =
                                  (Object.keys(prePaymentEmployee)
                                    .map((keyPre) => prePaymentEmployee[keyPre].sum)
                                    .filter((filterPre) => filterPre).length >= 1 &&
                                    activeCashBox &&
                                    (moment().set('date', prePaymentSettings.startDate).isSameOrBefore(moment()) || moment().set('date', prePaymentSettings.endDate).isSameOrAfter(moment()))) ||
                                  (isAggrement && Object.keys(prePaymentEmployee)?.filter((preKey) => prePaymentEmployee[preKey]?.sum).length >= 1);

                                if (isActive) {
                                  setShowPrePayment(true);
                                }
                              }}
                              class="filter__item"
                              style={{
                                background:
                                  (Object.keys(prePaymentEmployee)
                                    .map((keyPre) => prePaymentEmployee[keyPre].sum)
                                    .filter((filterPre) => filterPre).length >= 1 &&
                                    activeCashBox &&
                                    (moment().set('date', prePaymentSettings.startDate).isSameOrBefore(moment()) || moment().set('date', prePaymentSettings.endDate).isSameOrAfter(moment()))) ||
                                  (isAggrement && Object.keys(prePaymentEmployee)?.filter((preKey) => prePaymentEmployee[preKey]?.sum).length >= 1)
                                    ? '#FF0000'
                                    : '#BAB8B8',
                                color: '#Fff',
                                width: 'min-content',
                                height: '45px',
                              }}>
                              Выдать
                            </div>
                            <div>
                              С 21 по 31 числа месяца, самостоятельно, разрешено выдавать до 20 000 р, при этом на итоговом балансе, после выдачи аванса, должно оставаться 15 000 р и более. +Срочный аванс - доступен с 1 по 10 число месяца, либо в нестандартных ситуациях, в любое время.
                              {/* Доступно с {prePaymentSettings.startDate} по {prePaymentSettings.endDate} не более {prePaymentSettings.percent} руб */}
                            </div>
                            <div>
                              <label style={{ display: 'flex', alignItems: 'center', marginLeft: '20px', userSelect: 'none' }}>
                                <input
                                  defaultChecked={isAggrement}
                                  checked={isAggrement}
                                  type="checkbox"
                                  onChange={(event) => {
                                    setIsAggrement(event.target.checked);
                                    setPrePaymentEmployee({});
                                  }}
                                />
                                <span></span> СРОЧНО!
                              </label>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (!dataAccountList || dataAccountList?.length === 0) && !loadingAccountList ? (
                      <div style={{ margin: '40px auto 0 auto', textAlign: 'center', color: '#ff0d0d', display: 'flex', justifyContent: 'left', marginBottom: '60px' }}>Сотрудников не найдено</div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <div className="loading-account">Идет загрузка...</div>
                )
              ) : isManager === false || selectedEmployeeAccount ? (
                <>
                  {isManager && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {employeeAccountMoveBalance && <div style={{ marginLeft: '10px', marginBottom: '10px', marginRight: '10px' }}>Сотрудник: {employeeAccountMoveBalanceName}</div>}

                      <button
                        onClick={() => {
                          setSelectedEmployeeAccount(null);
                          setEmployeeAccountMoveBalance(false);
                        }}
                        style={{ height: '48px', marginLeft: '10px', marginBottom: '10px', color: '#377BFF', fontWeight: '700' }}>
                        Вернуться
                      </button>
                    </div>
                  )}
                  <div class="wrap__day">
                    <div className="table__common">
                      {employeeAccountMoveBalance ? (
                        <>
                          <div className="table__common-item">
                            <div className="table_common-left">Часы :&nbsp;</div>
                            <div className="table_common-right">{dataAccount?.hours || 0}</div>
                          </div>
                          <div className="table__common-item">
                            <div className="table_common-left">Текущий баланс:&nbsp;</div>
                            <div className="table_common-right">{dataAccount?.BeginBalance || 0}</div>
                          </div>{' '}
                          <div className="table__common-item">
                            <div className="table_common-left">С начала месяца :&nbsp;</div>
                            <div className="table_common-right">{dataAccount?.earned || 0}</div>
                          </div>{' '}
                          <div className="table__common-item">
                            <div className="table_common-left">Итоговый баланс :&nbsp;</div>
                            <div className="table_common-right">{dataAccount?.balance || 0}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="table__common-item">
                            <div className="table_common-left">Баланс:&nbsp;</div>
                            <div className="table_common-right">{dataAccount?.balance || 0}</div>
                          </div>
                          <div className="table__common-item">
                            <div className="table_common-left">Часы :&nbsp;</div>
                            <div className="table_common-right">{dataAccount?.hours || 0}</div>
                          </div>
                          <div className="table__common-item">
                            <div className="table_common-left">С начала месяца :&nbsp;</div>
                            <div className="table_common-right">{dataAccount?.earned || 0}</div>
                          </div>
                        </>
                      )}
                    </div>
                    <div class="blocks__item report " style={{ marginBottom: 0 }}>
                      <div className="date" style={{ gridGap: '0px', gridTemplateColumns: 'auto auto auto' }}>
                        <div className="date__wrap" style={{ marginRight: '20px', position: 'relative' }}>
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
                          <div className="loading-account">Идет загрузка...</div>
                        ) : (
                          <>
                            <button class="report__btn" onClick={handleSubmit(onSubmit)}>
                              Сформировать {!employeeAccountMoveBalance ? 'отчет о личном' : 'расшифровку'}
                            </button>

                            {!employeeAccountMoveBalance && (
                              <>
                                {dataAccount?.table && dataAccount?.table?.length > 0 && (
                                  <div class="report__total">
                                    Итого: <b>{dataAccount?.table?.map((row) => (parseFloat(row?.ranc) + parseFloat(row?.turn) + parseFloat(row?.margin)).toFixed(2)).reduce((partialSum, a) => (parseFloat(partialSum) + parseFloat(a)).toFixed(2), 0)}</b>
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    {((dataAccount?.table && dataAccount?.table?.length > 0) || (dataAccount?.MoveBalance && dataAccount?.MoveBalance?.length > 0)) && !loadingAccount ? (
                      <div className="table-common" style={{ ...(employeeAccountMoveBalance && { gridTemplateColumns: 'auto 1fr auto ' }) }}>
                        <div className="table-common__head">Дата</div>
                        <div className="table-common__head">{employeeAccountMoveBalance ? 'Движение' : 'Наименование'}</div>
                        {!employeeAccountMoveBalance && <div className="table-common__head">Кол-во</div>}
                        <div className="table-common__head">{!employeeAccountMoveBalance ? 'Сумма' : 'Бонус'}</div>
                        {employeeAccountMoveBalance
                          ? dataAccount?.MoveBalance?.map((row, indexRow) => (
                              <>
                                <div
                                  className={`table-common__cell ${indexRow % 2 !== 0 ? 'table-common__cell-odd' : ''}`}
                                  style={{
                                    ...(row?.TypeOfMovementNumber == 1
                                      ? {
                                          fontWeight: '600',
                                          color: '#000',
                                        }
                                      : row?.TypeOfMovementNumber == 2
                                      ? { color: 'green' }
                                      : row?.TypeOfMovementNumber == 3
                                      ? { color: 'red' }
                                      : {}),
                                  }}>
                                  {moment(row?.DateMovement).format('DD.MM.YYYY')}
                                </div>
                                <div
                                  className={`table-common__cell ${indexRow % 2 !== 0 ? 'table-common__cell-odd' : ''}`}
                                  style={{
                                    ...(row?.TypeOfMovementNumber == 1
                                      ? {
                                          fontWeight: '600',
                                          color: '#000',
                                        }
                                      : row?.TypeOfMovementNumber == 2
                                      ? { color: 'green' }
                                      : row?.TypeOfMovementNumber == 3
                                      ? { color: 'red' }
                                      : {}),
                                  }}>
                                  {row?.TypeOfMovementNumber == 1 ? 'Зачислено' : row?.TypeOfMovement}
                                </div>
                                <div
                                  className={`table-common__cell ${indexRow % 2 !== 0 ? 'table-common__cell-odd' : ''}`}
                                  style={{
                                    ...(row?.TypeOfMovementNumber == 1
                                      ? {
                                          fontWeight: '600',
                                          color: '#000',
                                        }
                                      : row?.TypeOfMovementNumber == 2
                                      ? { color: 'green' }
                                      : row?.TypeOfMovementNumber == 3
                                      ? { color: 'red' }
                                      : {}),
                                  }}>
                                  {currencyFormat(row?.Sum)}
                                </div>
                              </>
                            ))
                          : dataAccount?.table?.map((row, indexRow) => (
                              <>
                                <div className={`table-common__cell ${indexRow % 2 !== 0 ? 'table-common__cell-odd' : ''}`}>{moment(row?.date_sale).format('DD.MM.YYYY')}</div>
                                <div className={`table-common__cell ${indexRow % 2 !== 0 ? 'table-common__cell-odd' : ''}`}>{row?.product}</div>
                                <div className={`table-common__cell ${indexRow % 2 !== 0 ? 'table-common__cell-odd' : ''}`}>{row?.quantity}</div>
                                <div className={`table-common__cell ${indexRow % 2 !== 0 ? 'table-common__cell-odd' : ''}`}>{(parseFloat(row?.ranc) + parseFloat(row?.turn) + parseFloat(row?.margin)).toFixed(0)}</div>
                              </>
                            ))}
                      </div>
                    ) : (!dataAccount?.table || dataAccount?.table?.length === 0) && !loadingAccount ? (
                      <div style={{ margin: '40px auto 0 auto', textAlign: 'center', color: '#ff0d0d', display: 'flex', justifyContent: 'left', marginBottom: '60px' }}>
                        {employeeAccountMoveBalance ? 'На выбранный месяц нет расходов и доходов или данные не загрузились с 1С' : 'На выбраную дату продаж нет. Попробуйте выбрать рабочий день, где были продажи'}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          )}
          {childActiveTab === 'balance-history-tab' && isManager && <PrePaymentList list={listAccessSubdivision} />}
        </>
      ) : activeTab == 'plan-tab' ? (
        <PlanTab list={listAccessSubdivision} />
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div class="tab" style={{ marginTop: 0 }}>
              <button
                onClick={() => {
                  setActiveSubTab('graphic-subtab');
                }}
                class={`filter__item tablinks ${activeSubTab === 'graphic-subtab' && 'active'}`}>
                График
              </button>
            </div>
            {(dataUser?.postSubdivision?.postId == process.env.REACT_APP_DIRECTOR_POST_ID || dataUser?.id == 166 || dataUser?.accessBalance?.length !== 0) && (
              <div class="tab" style={{ marginTop: 0 }}>
                <button
                  onClick={() => {
                    setActiveSubTab('staff-subtab');
                  }}
                  class={`filter__item tablinks ${activeSubTab === 'staff-subtab' && 'active'}`}>
                  Штатное расписание
                </button>
              </div>
            )}
          </div>

          <div class="tabcontent">
            {activeSubTab == 'graphic-subtab' ? (
              <>
                {dataUser?.postSubdivision?.postId == process.env.REACT_APP_DIRECTOR_POST_ID || dataUser?.id == 166 ? (
                  <>
                    <WorkCalendar hideCalendar />
                    <AcceptedList onClick={handleClickOpenFullCalendar} />
                  </>
                ) : (
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
                          {[...dataUser?.subdivisions]
                            ?.sort((a, b) => a.name.localeCompare(b.name))
                            ?.map((itemSubdiv) => {
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
                        Рабочие часы:&nbsp;{' '}
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
                          {loadingEmployees ? <div className="loading-account">Идет загрузка...</div> : isAccessEditCalendar() ? 'Редактировать' : 'Просмотреть'}
                        </button>
                      }
                    </div>
                    <WorkCalendar />
                  </>
                )}

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
                        dispatch(resetGetSubdivisionWorkTimeTemplates());
                        dispatch(getAcceptWorkTable({ date: moment(activeMonthYear).format('YYYY-MM-DD').toString() }));
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
                      dispatch(getAcceptWorkTable({ date: moment(activeMonthYear).format('YYYY-MM-DD').toString() }));
                      dispatch(setShowFullCalendar(false));
                      dispatch(resetGetEmployees());
                      dispatch(getWorkCalendarMonth({ date: moment(activeMonthYear).format('YYYY-MM-DD').toString(), subdivision: activeCalendarSubdivision?.id }));
                    }}
                  />
                )}
              </>
            ) : (
              <StaffList />
            )}
          </div>
        </>
      )}
      {showSuccessPrePayment && (
        <Modal
          isThanks
          modalStyle={{
            maxWidth: '300px',
          }}>
          <div style={{ textAlign: 'center' }}>Аванс выдан и записан в историю</div>
        </Modal>
      )}
      {showErrorPrePayment && (
        <Modal
          isThanks
          modalStyle={{
            maxWidth: '300px',
          }}>
          <div style={{ textAlign: 'center', color: 'red' }}>Аванс не выдан, нет связи с 1С</div>
        </Modal>
      )}

      {showPrePayment && (
        <ModalPrePayment
          aggrement={isAggrement}
          setComment={setComment}
          comment={comment}
          loading={prePaymentLoading}
          list={prePaymentEmployee}
          onClose={() => {
            if (!prePaymentLoading) {
              dispatch(prePaymentCreate({ isAggrement, comment, list: prePaymentEmployee, subdivision: selectedAccessSubdivision?.value, cashBox: activeCashBox }));
            }
          }}
          onSave={() => {
            if (!prePaymentLoading) {
              setShowPrePayment(false);
            }
          }}
        />
      )}
    </>
  );
  //   )
  // );
  // );
};

export default AccountPage;
