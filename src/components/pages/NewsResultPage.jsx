import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Navigate } from 'react-router';
import clsx from 'clsx';
import moment from 'moment';
import SearchCard from '../SearchCard';
import { setActiveCalendarDates } from '../../redux/slices/news.slice';
const NewsResultPage = () => {
  const {
    getNewsCalendar: { data: calendarData },
    activeCalendarDates,
  } = useSelector((state) => state.news);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setActiveCalendarDates(null));
    };
  }, []);

  return activeCalendarDates ? (
    <>
      <div class="alert">
        <div class="container">
          <div class="alert__wrap">
            <div className="alert__title search__title">{`Мероприятия на ${moment(activeCalendarDates?.date).format('DD.MM.YYYY')}`}</div>
            {calendarData?.map((study) => activeCalendarDates?.list?.find((find) => find == study?.id) && <SearchCard link={`/news/${study?.id}`} title={study?.title} desc={study?.descShort} />)}
            {/* <SearchCard link={`/news/${newsItem?.id}`} title={newsItem?.title} desc={newsItem?.descShort} /> */}
          </div>
        </div>
      </div>
    </>
  ) : (
    <Navigate to="/study" />
  );
};

export default NewsResultPage;
