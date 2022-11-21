import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router';
import clsx from 'clsx';
import { Interweave } from 'interweave';
import { getUserNewsSingle } from '../../redux/actions/news/getUserNewsSingle.action';
import FilterNews from '../FilterNews';
import { addYouTubeIframe } from '../../utils/addYouTubeIframe';
import { resetGetAdminNewsSingle, resetGetUserNews, resetGetUserNewsSingle } from '../../redux/slices/news.slice';
const NewsSinglePage = () => {
  const { newsId } = useParams();
  const dispatch = useDispatch();
  const {
    getUserNewsSingle: { data: newsData },
  } = useSelector((state) => state.news);
  useEffect(() => {
    dispatch(getUserNewsSingle({ newsId }));
  }, [newsId]);
  useEffect(() => {
    return () => {
      dispatch(resetGetUserNews());
      dispatch(resetGetUserNewsSingle());
    };
  }, []);
  return (
    <div class="news__page">
      <div class="container">
        <div class="news__page__wrap">
          <div class="news__page__item">
            <div class="news__page__tittle">{newsData?.title}</div>
            <div dangerouslySetInnerHTML={{ __html: addYouTubeIframe(newsData?.desc) }} />
          </div>
        </div>
      </div>
      {newsData?.newsFilter?.newsTypeId && <FilterNews textNotFound={newsData?.newsFilter?.newsTypeId === 1 ? 'Новостей нет' : 'Обучений нет'} type={newsData?.newsFilter?.newsTypeId} />}
    </div>
  );
};

export default NewsSinglePage;
