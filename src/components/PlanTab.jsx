import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import { getCompetitionProducts } from '../redux/actions/employee/getCompetitionProducts.action';
import { getCompetitions } from '../redux/actions/employee/getCompetitions.action';
import { getEmployeeCompetitions } from '../redux/actions/employee/getEmployeeCompetitions.action';
import CalendarFilter from './CalendarFilter';
const PlanTab = () => {
  const {
    getEmployeeUser: { data: dataUser, loading: loadingUser, error: errorUser },
    getCompetitions: { data: dataCompetitions, loading: loadingCompetitions },
    getEmployeeCompetitions: { data: dataEmployeeCompetitions, loading: loadingEmployeeCompetitions },
    getCompetitionProducts: { data: dataCompetitionProducts, loading: loadingCompetitionProducts },
  } = useSelector((state) => state.employee);

  const {
    getEmployeeHistory: { data: employeeHistory },
    activeCalendarSubdivision,
  } = useSelector((state) => state.employeeHistory);
  const isManager = dataUser?.postSubdivision?.postId == process.env.REACT_APP_SELLER_ID;

  const [activeTab, setActiveTab] = useState('one-tab');
  const [activeCompetition, setActiveCompetition] = useState(null);
  const [selectedSubdiv, setSelectedSubdiv] = useState(!isManager);
  const [activeSubdiv, setActiveSubdiv] = useState(employeeHistory[0].idService);
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
      dispatch(getEmployeeCompetitions({ date: activeDate, subdiv: selectedSubdiv }));
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
        {selectedSubdiv && isManager && (
          <button
            onClick={() => {
              setSelectedSubdiv(false);
              setActiveEmployee(null);
            }}
            style={{ height: '48px', marginLeft: '10px', marginBottom: '10px', color: '#377BFF', fontWeight: '700' }}>
            ?????????? ?? ?????????? ????????????????????
          </button>
        )}

        <div class="modal__select">
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
          <button class="report__btn">???????????????????????? </button>
        </div>
      </div>
      {!selectedSubdiv &&
        (loadingCompetitions ? (
          <div className="loading-account" style={{ color: '#FF0505' }}>
            &nbsp;???????? ????????????????...
          </div>
        ) : dataCompetitions?.length >= 1 ? (
          dataCompetitions?.map(
            (itemCompt) =>
              itemCompt?.id_competition == activeCompetition && (
                <div class="tabcontent">
                  <table>
                    <tr class="table-plan-head">
                      <th width="170px">??????????????????????????</th>
                      {itemCompt?.use_personal_plan && <th width="100px">????????</th>}
                      {itemCompt?.use_plan && <th width="100px">????????</th>}

                      <th width="100px">?????????????? ????????????????????</th>
                      {itemCompt?.type_result != undefined && <th width="100px">{itemCompt?.type_result ? '????????????????????' : '??????????'}</th>}

                      <th width="100%">??????????</th>
                    </tr>
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

                            {itemCompt?.use_personal_plan && <td>{Math.ceil(massItem?.trade_city_sum)}</td>}
                            {itemCompt?.use_plan && <td>{massItem?.plan_city ? Math.ceil(massItem?.plan_city) : '-'}</td>}

                            <td>{Math.ceil(massItem?.trade_city_percent) + '%'}</td>
                            {itemCompt?.type_result != undefined && <td>{Math.ceil(massItem?.trade_city_quantity)}</td>}

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
            ?????????????????????????? ??????
          </div>
        ))}
      {selectedSubdiv &&
        (loadingEmployeeCompetitions ? (
          <div className="loading-account" style={{ color: '#FF0505' }}>
            &nbsp;???????? ????????????????...
          </div>
        ) : dataEmployeeCompetitions?.length >= 1 ? (
          dataEmployeeCompetitions?.map((itemEmpoyeComp) => {
            if (activeCompetition === itemEmpoyeComp?.id_competition) {
              const isUserPlan = itemEmpoyeComp?.mass_id?.filter((filterItem) => !filterItem?.name?.includes('undefined') && filterItem?.id_city === activeSubdiv && filterItem?.user_plan)?.length;
              const isTradeUserPlan = itemEmpoyeComp?.mass_id?.filter((filterItem) => !filterItem?.name?.includes('undefined') && filterItem?.id_city === activeSubdiv && filterItem?.trade_user_plan)?.length;
              return (
                <table>
                  <tr class="table-plan-title">
                    <th colSpan={'6'}>???????????????????? ?? ??????????????????????????</th>
                  </tr>
                  <tr class="table-plan-head">
                    <th>??????????????????</th>
                    <th>???????? ??????????</th>
                    {!!isUserPlan && <th>???????????? ????????</th>}
                    {!!isTradeUserPlan && <th>?????????????? ????????????????????</th>}

                    <th>????????????????????</th>
                    <th>??????????</th>
                  </tr>
                  {itemEmpoyeComp?.mass_id?.map(
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
                            <td>{Math.ceil(itemEmployMass?.trade_sum) || '-'}</td>
                            {!!isUserPlan && <td>{Math.ceil(itemEmployMass?.user_plan) ? itemEmployMass?.user_plan + '%' : '-'}</td>}
                            {!!isTradeUserPlan && <td>{Math.ceil(itemEmployMass?.trade_user_plan) || '-'}</td>}

                            <td>{Math.ceil(itemEmployMass?.trade_quantity)}</td>
                            <td>{itemEmployMass?.place}</td>
                          </tr>
                          {itemEmployMass.id === activeEmployee && (
                            <tr>
                              <td colSpan={6} style={{ padding: 0, background: '#F9F9F9' }}>
                                {loadingCompetitionProducts ? (
                                  <div className="loading-account" style={{ color: '#FF0505', padding: '15px 20px' }}>
                                    &nbsp;???????? ????????????????...
                                  </div>
                                ) : dataCompetitionProducts?.length >= 1 ? (
                                  <table style={{ marginTop: '0px' }}>
                                    {dataCompetitionProducts?.map((itemProd) => (
                                      <tr class="table-plan-row">
                                        <td style={{ whiteSpace: 'normal' }}>{itemProd?.product}</td>
                                        <td style={{ width: '89.96px' }}>{itemProd?.trade_quantity}</td>

                                        <td style={{ width: '79.72px' }}>{itemProd?.trade_sum}</td>
                                      </tr>
                                    ))}
                                  </table>
                                ) : (
                                  <div style={{ fontWeight: '600', color: '#FF0505', padding: '15px 20px' }}>?????????????? ???? ??????????????</div>
                                )}
                              </td>
                            </tr>
                          )}
                        </>
                      ),
                  )}
                </table>
              );
            }
          })
        ) : (
          <div style={{ color: '#FF0505' }}>?????????????????????? ???? ??????????????</div>
        ))}

      <>
        {/* <table style={{ marginTop: '20px' }}>
            <tr class="table-plan-title">
              <th colSpan={'6'}>?????? 3 ?????????????????? ???? ??????????????</th>
            </tr>
            <tr class="table-plan-head">
              <th width="170px">??????????????</th>
              <th width="100px">??????</th>
              <th width="100px">????????????</th>
              <th width="100px">??????????</th>
            </tr>
            <tr class="table-plan-row">
              <td>????????????</td>
              <td>?????????????? ????????</td>
              <td>43 021</td>
              <td>1</td>
            </tr>
            <tr class="table-plan-row ">
              <td>????????????????????????</td>
              <td>???????????? ????????</td>
              <td>12 120</td>
              <td>2</td>
            </tr>
            <tr class="table-plan-row ">
              <td>????????????</td>
              <td>???????????? ????????????</td>
              <td>21 991</td>
              <td>3</td>
            </tr>
            <tr class="table-plan-row table-plan-row-current">
              <td>????????????????????????</td>
              <td>???????????? ????????</td>
              <td>1 120</td>
              <td>34</td>
            </tr>
          </table> */}
      </>
    </>
  );
};

export default PlanTab;
