import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
const PlanTab = () => {
  const [activeTab, setActiveTab] = useState('one-tab');
  const [activeSubdiv, setActiveSubdiv] = useState(null);
  const {
    getEmployeeUser: { data: dataUser, loading: loadingUser, error: errorUser },
  } = useSelector((state) => state.employee);
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '-20px' }}>
        <div class="tab">
          <button
            onClick={() => {
              setActiveTab('one-tab');
              setActiveSubdiv(null);
            }}
            class={`filter__item tablinks ${activeTab === 'one-tab' && 'active'}`}>
            Оборот
          </button>
        </div>
        <div class="tab">
          <button
            onClick={() => {
              setActiveTab('two-tab');
              setActiveSubdiv(null);
            }}
            class={`filter__item tablinks ${activeTab === 'two-tab' && 'active'}`}>
            Сопутка
          </button>
        </div>
        <div class="tab">
          <button
            onClick={() => {
              setActiveTab('three-tab');
              setActiveSubdiv(null);
            }}
            class={`filter__item tablinks ${activeTab === 'three-tab' && 'active'}`}>
            #
          </button>
        </div>
        <div class="tab">
          <button
            onClick={() => {
              setActiveTab('4-tab');
              setActiveSubdiv(null);
            }}
            class={`filter__item tablinks ${activeTab === '4-tab' && 'active'}`}>
            Карты
          </button>
        </div>
        <div class="tab">
          <button
            onClick={() => {
              setActiveTab('5-tab');
              setActiveSubdiv(null);
            }}
            class={`filter__item tablinks ${activeTab === '5-tab' && 'active'}`}>
            Услуги
          </button>
        </div>
        <div class="tab ">
          <button
            onClick={() => {
              setActiveTab('6-tab');
              setActiveSubdiv(null);
            }}
            class={`filter__item tab-red tablinks ${activeTab === '6-tab' && 'active'}`}>
            Архив
          </button>
        </div>
      </div>
      {activeSubdiv || dataUser?.postSubdivision?.postId != process.env.REACT_APP_MANAGER_ID ? (
        <div style={{ marginBottom: '30px ', marginTop: '10px', fontWeight: '600' }}>{`Подразделение ${dataUser?.subdivision || activeSubdiv}`}</div>
      ) : (
        <div className="blocks__item report ">
          {' '}
          <div className="date__wrap" style={{ marginRight: '20px', position: 'relative' }}>
            <input type="text" style={{ marginBottom: 0, width: '100px', userSelect: 'none', caretColor: 'transparent', cursor: 'pointer' }} value={moment().format('DD.MM.YYYY')} />
          </div>{' '}
          <button class="report__btn">Сформировать </button>
        </div>
      )}

      {activeSubdiv || dataUser?.postSubdivision?.postId != process.env.REACT_APP_MANAGER_ID ? (
        <>
          <table>
            <tr class="table-plan-title">
              <th colSpan={'6'}>Сотрудники в подразделении</th>
            </tr>
            <tr class="table-plan-head">
              <th>Сотрудник</th>
              <th>Факт</th>
              <th>План</th>
              <th>Прогноз</th>
              <th>Оборот</th>
              <th>Место</th>
            </tr>
            <tr class="table-plan-row">
              <td>Сидоров Петр</td>
              <td>120 000</td>
              <td>1 500 000</td>
              <td>80%</td>
              <td>43 021</td>
              <td>1</td>
            </tr>
            <tr class="table-plan-row ">
              <td>Иванов Иван</td>
              <td>120 000</td>
              <td>1 500 000</td>
              <td>80%</td>
              <td>43 021</td>
              <td>2</td>
            </tr>
            <tr class="table-plan-row table-plan-row-current">
              <td>Петров Никита</td>
              <td>120 000</td>
              <td>1 500 000</td>
              <td>80%</td>
              <td>43 021</td>
              <td>3</td>
            </tr>
            <tr class="table-plan-row ">
              <td>Иванов Иван</td>
              <td>120 000</td>
              <td>1 500 000</td>
              <td>80%</td>
              <td>43 021</td>
              <td>4</td>
            </tr>
            <tr class="table-plan-row">
              <td>Петров Никита</td>
              <td>120 000</td>
              <td>1 500 000</td>
              <td>80%</td>
              <td>43 021</td>
              <td>5</td>
            </tr>
          </table>
          <table style={{ marginTop: '20px' }}>
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
          </table>{' '}
        </>
      ) : activeTab == 'one-tab' ? (
        <div class="tabcontent">
          <table>
            <tr class="table-plan-head">
              <th width="170px">Подразделение</th>
              <th width="100px">Факт</th>
              <th width="100px">План</th>
              <th width="100px">Прогноз</th>
              <th width="100%">Место</th>
            </tr>
            <tr
              class="table-plan-row"
              onClick={() => {
                setActiveSubdiv('Абакан');
              }}>
              <td>Абакан</td>
              <td>120 000</td>
              <td>1 500 000</td>
              <td>80%</td>
              <td>1</td>
            </tr>
            <tr
              class="table-plan-row "
              onClick={() => {
                setActiveSubdiv('Зеленогорск');
              }}>
              <td>Зеленогорск</td>
              <td>120 000</td>
              <td>1 500 000</td>
              <td>80%</td>
              <td>2</td>
            </tr>
            <tr
              class="table-plan-row"
              onClick={() => {
                setActiveSubdiv('Аэровокзальная');
              }}>
              <td>Аэровокзальная</td>
              <td>120 000</td>
              <td>1 500 000</td>
              <td>80%</td>
              <td>3</td>
            </tr>
            <tr
              class="table-plan-row table-plan-row-current"
              onClick={() => {
                setActiveSubdiv('Сосновоборск');
              }}>
              <td>Сосновоборск</td>
              <td>120 000</td>
              <td>1 500 000</td>
              <td>80%</td>
              <td>4</td>
            </tr>
            <tr
              class="table-plan-row"
              onClick={() => {
                setActiveSubdiv('Тельмана');
              }}>
              <td>Тельмана</td>
              <td>120 000</td>
              <td>1 500 000</td>
              <td>80%</td>
              <td>5</td>
            </tr>
          </table>
        </div>
      ) : activeTab == 'two-tab' ? (
        <div class="tabcontent"></div>
      ) : (
        <div class="tabcontent"></div>
      )}
    </>
  );
};

export default PlanTab;
