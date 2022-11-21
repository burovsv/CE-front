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
    getAccount: { data: dataAccount, loading: loadingAccount, error: errorAccount },
    getEmployeeUser: { data: dataUser, loading: loadingUser, error: errorUser },
    getEmployees: { data: employees, loading: loadingEmployees, error: errorEmployees },
  } = useSelector((state) => state.employee);
  useEffect(() => {
    const paramsEmployees = { page: 0, search: '', subdivision: dataUser?.postSubdivision?.subdivisionId };
    dispatch(getEmployees(paramsEmployees));
  }, [dataUser]);

  const dateWatch = watch('date');
  const onBlurDate = () => {
    const isValidDate = moment(getValues('date')).isValid();
    if (!isValidDate) {
      setValue('date', moment().format('DD.MM.YYYY'));
    }
  };
  const dispatch = useDispatch();
  const {
    getEmployeeUser: { data: employee },
  } = useSelector((state) => state.employee);
  const onSubmit = (data) => {
    dispatch(getAccount({ idService: employee?.idService, date: moment(data?.date).format('YYYY-MM-DD') }));
  };

  // return errorAccount ? (
  //   <Navigate to={'/'} />
  // ) : (
  //  (
  //   dataAccount && (
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState('balance-tab');
  const [showDateFilter, setShowDateFilter] = useState(false);
  useEffect(() => {
    if (showFullCalendar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showFullCalendar]);

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
        </div>
        <div class="tab">
          <button
            onClick={() => {
              setActiveTab('graphic-tab');
            }}
            class={`filter__item tablinks ${activeTab === 'graphic-tab' && 'active'}`}>
            График
          </button>
        </div>
      </div>
      {activeTab == 'balance-tab' ? (
        <div class="tabcontent">
          <div class="wrap__day">
            <div className="table__common">
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
                  <div className="loading-account">Идет загрузка...</div>
                ) : (
                  <>
                    <button class="report__btn" onClick={handleSubmit(onSubmit)}>
                      Сформировать отчет о личном
                    </button>

                    {dataAccount?.table && dataAccount?.table?.length > 0 && (
                      <div class="report__total">
                        Итого: <b>{dataAccount?.table?.map((row) => (parseFloat(row?.ranc) + parseFloat(row?.turn) + parseFloat(row?.margin)).toFixed(2)).reduce((partialSum, a) => (parseFloat(partialSum) + parseFloat(a)).toFixed(2), 0)}</b>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            {dataAccount?.table && dataAccount?.table?.length > 0 && !loadingAccount ? (
              <div className="table-common">
                <div className="table-common__head">Дата</div>
                <div className="table-common__head">Наименование</div>
                <div className="table-common__head">Кол-во</div>
                <div className="table-common__head">Бонус</div>
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
              <div style={{ margin: '40px auto 0 auto', textAlign: 'center', color: '#ff0d0d', display: 'flex', justifyContent: 'left', marginBottom: '60px' }}>На выбраную дату продаж нет. Попробуйте выбрать рабочий день, где были продажи</div>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <div class="tabcontent">
          {loadingEmployees ? (
            <div style={{ marginLeft: '20px' }} className="loading-account">
              Идет загрузка...
            </div>
          ) : (
            <>
              {employees?.length >= 1 && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div class="modal__select">
                    <select style={{ width: '218px' }}>
                      {employees.map((value) => {
                        return <option selected={value?.id === dataUser?.id} value={value?.id}>{`${value?.firstName} ${value?.lastName}`}</option>;
                      })}
                    </select>
                  </div>
                  <div style={{ padding: '15px 20px', marginBottom: '20px', background: '#fff', marginLeft: '20px' }}>
                    Рабочие часы:&nbsp; <b>87</b>
                  </div>
                  <button
                    onClick={() => {
                      setShowFullCalendar(true);
                    }}
                    class="report__btn"
                    style={{ marginBottom: '20px', marginLeft: '20px' }}>
                    Редактировать
                  </button>
                </div>
              )}
              <WorkCalendar />
              {showFullCalendar && (
                <WorkCalendarFull
                  onClose={() => {
                    setShowFullCalendar(false);
                  }}
                />
              )}
            </>
          )}
        </div>
      )}
    </>
  );
  //   )
  // );
  // );
};

export default AccountPage;
