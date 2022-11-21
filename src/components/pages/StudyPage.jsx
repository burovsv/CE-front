import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import FilterNews from '../FilterNews';
import { resetGetNewsCalendar, resetGetUserNews } from '../../redux/slices/news.slice';
import { resetGetNewsFilterUser } from '../../redux/slices/newsFilter.slice';
import { getNewsCalendar } from '../../redux/actions/news/getNewsCalendar.action';
const StudyPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetGetNewsFilterUser());
      dispatch(resetGetUserNews());
    };
  }, []);
  return (
    <>
      <FilterNews type={2} textNotFound={'Обучений нет'} />
    </>
  );
};

export default StudyPage;
