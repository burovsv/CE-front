import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
const TestingCard = ({ name, dateEnd, desc, linkTest }) => {
  return (
    <>
      {' '}
      <div class="testing__item tools">
        <div class="testing__tittle">{name}</div>
        <div class="testing__data">{`Пройти до ${dateEnd}`}</div>
        {/* <div class="testing__text"></div> */}
        <div class="testing__list">
          <br />
          {desc}
        </div>
        <button>
          <a class="testing__btn" target="_blank" href={linkTest}>
            Начать
          </a>
        </button>
      </div>
    </>
  );
};

export default TestingCard;
