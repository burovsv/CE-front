import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import Modal from './Modal';
import { setActiveModal } from '../../redux/slices/app.slice';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { useForm, Controller } from 'react-hook-form';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToHTML } from 'draft-convert';
import CheckboxGroup from '../CheckboxGroup';
import { getNewsTypes } from '../../redux/actions/newsType/getNewsTypes.action';
import Loading from '../Loading';
import { getNewsFilters } from '../../redux/actions/newsFilter/getNewsFilters.action';
import { createNewsFilter } from '../../redux/actions/newsFilter/createNewsFilter.action';
import { getPosts } from '../../redux/actions/post/getPosts.action';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import { createNews } from '../../redux/actions/news/createNews.action';
import { getSubdivisions } from '../../redux/actions/subdivision/getSubdivisions.action';
import axios from 'axios';
import { getSubdivisionsWithPosts } from '../../redux/actions/subdivision/getSubdivisionWithPosts.action';
import { getCatsByPostAndSubdiv } from '../../redux/actions/category/getCatsByPostAndSubdiv';
import { resetGetSubdivisionsWithPosts } from '../../redux/slices/subdivision.slice';
import { resetGetCatsByPostAndSubdiv } from '../../redux/slices/category.slice';
import { createTesting } from '../../redux/actions/testing/createTesting.action';
import { resetGetAdminTestingSingle } from '../../redux/slices/testing.slice';
import { updateTesting } from '../../redux/actions/testing/updateTesting.action';
import { resetFeedbackEmployee } from '../../redux/slices/employee.slice';
import { feedbackEmployee } from '../../redux/actions/employee/feedback.action';
const ModalFeedback = () => {
  const defaultValues = {
    message: '',
    anonym: false,
  };
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
    feedbackEmployee: { data: feedbackData, loading: feedbackLoading },
  } = useSelector((state) => state.employee);
  const onSubmit = (data) => {
    dispatch(feedbackEmployee(data));
  };
  useEffect(() => {
    if (feedbackData && !feedbackLoading) {
      dispatch(resetFeedbackEmployee());
      dispatch(setActiveModal('modal-feedback-thank'));
    }
  }, [feedbackData, feedbackLoading]);

  const dispatch = useDispatch();
  return (
    <>
      <Modal
        title="Письмо доверия"
        onSave={handleSubmit(onSubmit)}
        disabled={feedbackLoading}
        onClose={() => {
          dispatch(resetFeedbackEmployee());
        }}
        modalStyle={{
          padding: '22px 12px 20px 12px',
          maxWidth: '384px',
        }}
        titleCenter
        textSend={feedbackLoading ? 'Отправка...' : 'Отправить'}
        textCancel={'Назад'}>
        <div style={{ minHeight: '270px', position: 'relative' }}>
          <div className="">
            <div
              className=""
              style={{
                maxWidth: '311px',
                textAlign: 'center',
                margin: '0 auto',
                marginTop: '33px',
                marginBottom: '50px',
              }}>
              Вы можете написать предложение, просьбу, коментарий к чему либо. Мы обязательно рассмотрим ваше сообщение
            </div>
            <textarea disabled={feedbackLoading} placeholder="Ваше сообщение..." rows="3" {...register('message', { required: true })}></textarea>
            <label style={{}}>
              <input disabled={feedbackLoading} type="checkbox" {...register(`anonym`)} /> <span style={{ margin: '0 auto', justifyContent: 'center', marginBottom: '26px', marginTop: '12px' }}>Анонимно</span>
            </label>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalFeedback;
