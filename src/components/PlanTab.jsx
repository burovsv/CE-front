import axios from 'axios';
import fileDownload from 'js-file-download';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import { createCompetitionReport } from '../redux/actions/employee/createCompetitionReport.action';
import { getCompetitionProducts } from '../redux/actions/employee/getCompetitionProducts.action';
import { getCompetitions } from '../redux/actions/employee/getCompetitions.action';
import { getEmployeeCompetitions } from '../redux/actions/employee/getEmployeeCompetitions.action';
import { resetCreateCompetitionReport } from '../redux/slices/employee.slice';
import CalendarFilter from './CalendarFilter';
import { currencyFormat } from '../utils/currencyFormat';
const PlanTab = ({ list }) => {
  const {
    getEmployeeUser: { data: dataUser, loading: loadingUser, error: errorUser },
    getCompetitions: { data: dataCompetitions, loading: loadingCompetitions },
    getEmployeeCompetitions: { data: dataEmployeeCompetitions, loading: loadingEmployeeCompetitions },
    getCompetitionProducts: { data: dataCompetitionProducts, loading: loadingCompetitionProducts },
    createCompetitionReport: { data: downloadReport, loading: loadingReport },
  } = useSelector((state) => state.employee);

  const {
    getEmployeeHistory: { data: employeeHistory },
    activeCalendarSubdivision,
  } = useSelector((state) => state.employeeHistory);
  const isManager = dataUser?.postSubdivision?.postId == process.env.REACT_APP_SELLER_ID || dataUser?.postSubdivision?.postId == process.env.REACT_APP_DIRECTOR_POST_ID || dataUser?.id == 166;

  const [activeTab, setActiveTab] = useState('one-tab');
  const [activeCompetition, setActiveCompetition] = useState(null);
  const [selectedSubdiv, setSelectedSubdiv] = useState(!isManager);
  const [activeSubdiv, setActiveSubdiv] = useState(employeeHistory?.[0]?.idService);
  const [activeEmployee, setActiveEmployee] = useState(null);
  const [activeDate, setActiveDate] = useState(moment().subtract(1, 'days').toDate());

  const dispatch = useDispatch();
  useEffect(() => {
    if (activeSubdiv && activeDate) {
      dispatch(getCompetitions({ date: activeDate, subdiv: activeSubdiv }));
    }
  }, [activeDate, activeSubdiv]);

  useEffect(() => {
    if (activeSubdiv && activeDate && selectedSubdiv) {
      dispatch(getEmployeeCompetitions({ date: activeDate, subdiv: activeSubdiv }));
    }
  }, [activeDate, activeSubdiv, selectedSubdiv]);

  useEffect(() => {
    setActiveEmployee(null);
  }, [activeCompetition]);
  useEffect(() => {
    if (dataCompetitions) {
      setActiveCompetition(dataCompetitions[0]?.id_competition);
    }
  }, [dataCompetitions]);
  useEffect(() => {
    if (activeDate && activeEmployee && activeSubdiv && activeCompetition) {
      dispatch(getCompetitionProducts({ date: activeDate, subdiv: activeSubdiv, employee: activeEmployee, competition: activeCompetition }));
    }
  }, [activeDate, activeEmployee, activeSubdiv, activeCompetition]);
  const [showDateFilter, setShowDateFilter] = useState(false);

  useEffect(() => {
    if (downloadReport?.file) {
      axios
        .get(downloadReport?.file, {
          responseType: 'blob',
        })
        .then((res) => {
          fileDownload(res.data, downloadReport?.fileName);
          dispatch(resetCreateCompetitionReport());
        });
    }
  }, [downloadReport]);
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '-20px', flexWrap: 'wrap', marginTop: '0px' }}>
        {dataCompetitions?.length >= 1 &&
          dataCompetitions?.map((itemComp) => (
            <div class="tab" style={{ marginTop: '0px', marginRight: '0px', marginBottom: '20px' }}>
              <button
                onClick={() => {
                  setActiveCompetition(itemComp?.id_competition);
                }}
                class={`filter__item tablinks ${activeCompetition === itemComp?.id_competition && 'active'}`}>
                {itemComp?.name_competition}
              </button>
            </div>
          ))}
      </div>
      {selectedSubdiv && isManager && (
        <button
          onClick={() => {
            setSelectedSubdiv(false);
            setActiveEmployee(null);
          }}
          style={{ height: '48px', marginLeft: '10px', marginBottom: '10px', color: '#377BFF', fontWeight: '700' }}>
          Назад к общей информации
        </button>
      )}
      <div style={{ display: 'flex', alignItems: 'start' }}>
        <div class="modal__select" style={{ marginRight: '20px' }}>
          <select
            value={activeSubdiv}
            style={{ width: '236px' }}
            onChange={(event) => {
              setActiveSubdiv(event.target.value);
            }}>
            {employeeHistory.map((value) => {
              return (
                <option selected={value?.idService === activeCalendarSubdivision?.idService} value={value?.idService}>
                  {value?.name}
                </option>
              );
            })}
            {list?.map((listItem) => {
              const findEmployeeHistory = employeeHistory?.find((employeeHistoryItem) => employeeHistoryItem.idService == listItem.id);
              console.log(listItem);
              if (!findEmployeeHistory) {
                return (
                  <option selected={listItem?.id === activeCalendarSubdivision?.idService} value={listItem?.id}>
                    {listItem?.label}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className="blocks__item report ">
          {' '}
          <div className="date__wrap" style={{ marginRight: '20px', position: 'relative' }}>
            <input
              type="text"
              style={{ marginBottom: 0, width: '100px', userSelect: 'none', caretColor: 'transparent', cursor: 'pointer' }}
              value={moment(activeDate).format('DD.MM.YYYY')}
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
                  setActiveDate(dateNews);
                }}
                date={activeDate}
                onClose={() => setShowDateFilter(false)}
              />
            )}
          </div>{' '}
          {(dataUser?.postSubdivision?.postId == process.env.REACT_APP_DIRECTOR_POST_ID || dataUser?.id == 166) && (
            <button
              disabled={loadingReport}
              class="report__btn"
              onClick={() => {
                dispatch(createCompetitionReport({ date: activeDate, subdiv: activeSubdiv, compititionId: activeCompetition }));
              }}>
              {!loadingReport ? 'Отчет' : 'Загрузка...'}
            </button>
          )}
        </div>
      </div>
      {!selectedSubdiv &&
        (loadingCompetitions ? (
          <div className="loading-account" style={{ color: '#FF0505' }}>
            &nbsp;Идет загрузка...
          </div>
        ) : dataCompetitions?.length >= 1 ? (
          dataCompetitions?.map(
            (itemCompt) =>
              itemCompt?.id_competition == activeCompetition && (
                <div class="tabcontent">
                  <table>
                    <tr class="table-plan-head">
                      <th width="170px">Подразделение</th>
                      {itemCompt?.use_personal_plan && <th width="100px">Факт</th>}
                      {itemCompt?.mass_city[0]?.mass_segment && itemCompt?.mass_city[0]?.mass_segment?.map((itemSegm) => <th>{itemSegm?.segment}</th>)}
                      {itemCompt?.use_plan && <th width="100px">План</th>}

                      {<th width="100px">{itemCompt?.use_quantity ? 'Количество' : 'Факт'}</th>}

                      {itemCompt?.use_plan && <th width="100px">Прогноз выполнения</th>}
                      <th width="100%">Место</th>
                    </tr>
                    {itemCompt?.mass_city[0]?.mass_segment && (
                      <tr class="table-plan-head">
                        <th width="170px"></th>
                        {itemCompt?.use_personal_plan && <th width="100px"></th>}
                        {itemCompt?.mass_city[0]?.mass_segment &&
                          itemCompt?.mass_city[0]?.mass_segment?.map((itemSegm) => (
                            <th style={{ padding: '0' }}>
                              <td>кол-во</td>
                              <td>сумма</td>
                            </th>
                          ))}
                        {itemCompt?.use_plan && <th width="100px"></th>}

                        {<th width="100px">{}</th>}

                        {itemCompt?.use_plan && <th width="100px"></th>}
                        <th width="100%"></th>
                      </tr>
                    )}

                    {itemCompt?.mass_city?.map(
                      (massItem) =>
                        massItem?.name_city && (
                          <tr
                            class={`table-plan-row ${massItem?.id_city == activeSubdiv ? 'table-plan-row-current' : ''}`}
                            onClick={() => {
                              if (massItem?.id_city == activeSubdiv) {
                                setSelectedSubdiv(true);
                              }
                            }}>
                            <td>{massItem?.name_city || '-'}</td>
                            {massItem?.mass_segment?.map((itemSegm) => (
                              <td width="100%" style={{ padding: 0 }}>
                                <td width="100%">
                                  <div style={{ textAlign: 'center', paddingRight: '7px' }}>{itemSegm?.segment_quantity}</div>
                                </td>
                                <td width="100%">
                                  <div style={{ textAlign: 'center', paddingRight: '7px' }}>{itemSegm?.segment_sum}</div>
                                </td>
                              </td>
                            ))}
                            {itemCompt?.use_personal_plan && <td>{currencyFormat(Math.ceil(massItem?.trade_city_sum))}</td>}
                            {itemCompt?.use_plan && <td>{currencyFormat(massItem?.plan_city) ? currencyFormat(Math.ceil(massItem?.plan_city)) : '-'}</td>}

                            {<td>{itemCompt?.use_quantity ? Math.ceil(massItem?.trade_city_quantity) : currencyFormat(Math.ceil(massItem?.trade_city_sum))}</td>}

                            {itemCompt?.use_plan && <td>{parseInt(massItem?.forecast)}%</td>}

                            <td>{massItem?.place_city}</td>
                          </tr>
                        ),
                    )}
                  </table>
                </div>
              ),
          )
        ) : (
          <div className="loading-account" style={{ color: '#FF0505' }}>
            Подразделений нет
          </div>
        ))}
      {selectedSubdiv &&
        (loadingEmployeeCompetitions ? (
          <div className="loading-account" style={{ color: '#FF0505' }}>
            &nbsp;Идет загрузка...
          </div>
        ) : dataEmployeeCompetitions?.length >= 1 ? (
          dataEmployeeCompetitions?.map((itemEmpoyeComp) => {
            if (activeCompetition === itemEmpoyeComp?.id_competition) {
              let employeeListResult = [];
              const isUserPlan = itemEmpoyeComp?.mass_id?.filter((filterItem) => !filterItem?.name?.includes('undefined') && filterItem?.id_city === activeSubdiv && filterItem?.user_plan)?.length;
              const isTradeUserPlan = itemEmpoyeComp?.mass_id?.filter((filterItem) => !filterItem?.name?.includes('undefined') && filterItem?.id_city === activeSubdiv && filterItem?.trade_user_plan)?.length;
              const employeeListDefault = [...itemEmpoyeComp?.mass_id]?.sort((a, b) => a.place - b.place);
              if (!itemEmpoyeComp?.group_competition) {
                employeeListResult = [...itemEmpoyeComp?.mass_id]?.sort((a, b) => a.place - b.place);
              } else {
                if (itemEmpoyeComp?.use_quantity) {
                  employeeListResult = [...itemEmpoyeComp?.mass_id]
                    ?.sort((a, b) => b.trade_sum - a.trade_sum)
                    .slice(0, 10)
                    ?.map((empl, emplIndex) => ({ ...empl, place: emplIndex + 1 }));
                } else {
                  employeeListResult = [...itemEmpoyeComp?.mass_id]
                    ?.sort((a, b) => b.trade_quantity - a.trade_quantity || b.trade_sum - a.trade_sum)
                    .slice(0, 10)
                    ?.map((empl, emplIndex) => ({ ...empl, place: emplIndex + 1 }));
                }
              }
              return (
                <>
                  {itemEmpoyeComp?.group_competition && (
                    <table style={{ marginBottom: '20px' }}>
                      <tr class="table-plan-title">
                        <th colSpan={'6'}>ТОП 10 продавцов за конкурс по всем подразделениям</th>
                      </tr>
                      <tr class="table-plan-head">
                        <th>Сотрудник</th>

                        {!!isUserPlan && <th>Личный план</th>}
                        <th>Факт сумма</th>
                        {!!isTradeUserPlan && <th>Процент выполнение</th>}

                        <th>Количество</th>
                        <th>Место</th>
                      </tr>
                      {employeeListResult?.map(
                        (itemEmployMass) =>
                          !itemEmployMass?.name?.includes('undefined') &&
                          (itemEmployMass?.id_city === activeSubdiv || itemEmpoyeComp?.group_competition) && (
                            <>
                              <tr
                                onClick={() => {
                                  const isShowEmpl = isManager || dataUser?.idService == itemEmployMass.id;
                                  if (isShowEmpl) {
                                    if (activeEmployee) {
                                      setActiveEmployee(null);
                                    } else {
                                      setActiveEmployee(itemEmployMass?.id);
                                    }
                                  }
                                }}
                                class={`table-plan-row ${dataUser?.idService == itemEmployMass.id || itemEmployMass?.id_city === activeSubdiv ? 'table-plan-row-current' : ''}`}>
                                <td>{itemEmployMass?.name}</td>

                                {!!isUserPlan && <td>{currencyFormat(Math.ceil(itemEmployMass?.user_plan)) ? currencyFormat(parseInt(itemEmployMass?.user_plan)) : '-'}</td>}
                                <td>{currencyFormat(Math.ceil(itemEmployMass?.trade_sum)) || '-'}</td>
                                {!!isTradeUserPlan && <td>{currencyFormat(Math.ceil(itemEmployMass?.trade_user_plan)) || '-'}</td>}

                                <td>{Math.ceil(itemEmployMass?.trade_quantity)}</td>
                                <td>{itemEmployMass?.place}</td>
                              </tr>
                              {itemEmployMass.id === activeEmployee && (
                                <>
                                  {loadingCompetitionProducts ? (
                                    <tr style={{ padding: 0, background: '#F9F9F9' }}>
                                      <td colSpan={4} className="loading-account" style={{ color: '#FF0505', padding: '15px 20px' }}>
                                        &nbsp;Идет загрузка...
                                      </td>
                                    </tr>
                                  ) : dataCompetitionProducts?.length >= 1 ? (
                                    dataCompetitionProducts?.map((itemProd) => (
                                      <tr class="table-plan-row" style={{ background: '#f2f2f2' }}>
                                        <td style={{ whiteSpace: 'normal' }}>{itemProd?.product}</td>
                                        <td>{itemProd?.trade_sum}</td>
                                        <td>{itemProd?.trade_quantity}</td>
                                        <td></td>
                                      </tr>
                                    ))
                                  ) : (
                                    <div style={{ fontWeight: '600', color: '#FF0505', padding: '15px 20px' }}>Товаров не найдено</div>
                                  )}
                                </>
                              )}
                            </>
                          ),
                      )}
                    </table>
                  )}
                  <table>
                    <tr class="table-plan-title">
                      <th colSpan={'6'}>Сотрудники в подразделении</th>
                    </tr>
                    <tr class="table-plan-head">
                      <th>Сотрудник</th>

                      {!!isUserPlan && <th>Личный план</th>}
                      <th>Факт сумма</th>
                      {!!isTradeUserPlan && <th>Процент выполнение</th>}

                      <th>Количество</th>
                      <th>Место</th>
                    </tr>
                    {employeeListDefault?.map(
                      (itemEmployMass) =>
                        !itemEmployMass?.name?.includes('undefined') &&
                        itemEmployMass?.id_city === activeSubdiv && (
                          <>
                            <tr
                              onClick={() => {
                                const isShowEmpl = isManager || dataUser?.idService == itemEmployMass.id;
                                if (isShowEmpl) {
                                  if (activeEmployee) {
                                    setActiveEmployee(null);
                                  } else {
                                    setActiveEmployee(itemEmployMass?.id);
                                  }
                                }
                              }}
                              class={`table-plan-row ${dataUser?.idService == itemEmployMass.id ? 'table-plan-row-current' : ''}`}>
                              <td>{itemEmployMass?.name}</td>

                              {!!isUserPlan && <td>{currencyFormat(Math.ceil(itemEmployMass?.user_plan)) ? currencyFormat(parseInt(itemEmployMass?.user_plan)) : '-'}</td>}
                              <td>{currencyFormat(Math.ceil(itemEmployMass?.trade_sum)) || '-'}</td>
                              {!!isTradeUserPlan && <td>{currencyFormat(Math.ceil(itemEmployMass?.trade_user_plan)) || '-'}</td>}

                              <td>{Math.ceil(itemEmployMass?.trade_quantity)}</td>
                              <td>{itemEmployMass?.place}</td>
                            </tr>
                            {itemEmployMass.id === activeEmployee && (
                              <>
                                {loadingCompetitionProducts ? (
                                  <tr style={{ padding: 0, background: '#F9F9F9' }}>
                                    <td colSpan={4} className="loading-account" style={{ color: '#FF0505', padding: '15px 20px' }}>
                                      &nbsp;Идет загрузка...
                                    </td>
                                  </tr>
                                ) : dataCompetitionProducts?.length >= 1 ? (
                                  dataCompetitionProducts?.map((itemProd) => (
                                    <tr class="table-plan-row" style={{ background: '#f2f2f2' }}>
                                      <td style={{ whiteSpace: 'normal' }}>{itemProd?.product}</td>
                                      <td>{itemProd?.trade_sum}</td>
                                      <td>{itemProd?.trade_quantity}</td>
                                      <td></td>
                                    </tr>
                                  ))
                                ) : (
                                  <div style={{ fontWeight: '600', color: '#FF0505', padding: '15px 20px' }}>Товаров не найдено</div>
                                )}
                              </>
                            )}
                          </>
                        ),
                    )}
                  </table>
                </>
              );
            }
          })
        ) : (
          <div style={{ color: '#FF0505' }}>Сотрудников не найдено</div>
        ))}

      <>
        {/* <table style={{ marginTop: '20px' }}>
            <tr class="table-plan-title">
              <th colSpan={'6'}>ТОП 3 продавцов за квартал</th>
            </tr>
            <tr class="table-plan-head">
              <th width="170px">Магазин</th>
              <th width="100px">ФИО</th>
              <th width="100px">Оборот</th>
              <th width="100px">Место</th>
            </tr>
            <tr class="table-plan-row">
              <td>Абакан</td>
              <td>Сидоров Петр</td>
              <td>43 021</td>
              <td>1</td>
            </tr>
            <tr class="table-plan-row ">
              <td>Сосновоборск</td>
              <td>Иванов Иван</td>
              <td>12 120</td>
              <td>2</td>
            </tr>
            <tr class="table-plan-row ">
              <td>Ачинск</td>
              <td>Петров Никита</td>
              <td>21 991</td>
              <td>3</td>
            </tr>
            <tr class="table-plan-row table-plan-row-current">
              <td>Сосновоборск</td>
              <td>Иванов Иван</td>
              <td>1 120</td>
              <td>34</td>
            </tr>
          </table> */}
      </>
    </>
  );
};

export default PlanTab;
