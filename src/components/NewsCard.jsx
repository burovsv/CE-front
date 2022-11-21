import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
const NewsCard = ({ title, descShort, dateStart, image, id }) => {
  return (
    <Link
      class="news__item first__ride"
      to={`/news/${id}`}
      onClick={() => {
        window.scrollTo(0, 0);
      }}>
      <div class="news__img">
        <img src={`${process.env.REACT_APP_SERVER_URL}/images/${image}`} alt="" />
      </div>
      <div class="news__content">
        <div class="news__tittle">{title}</div>
        <div class="news__subtittle">{descShort} </div>
        <div class="news__footer">
          <div class="news__data">{moment(dateStart).format('DD.MM.YYYY')}</div>
          <div class="news__view">
            <img src="" alt="" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
