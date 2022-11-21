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

import Loading from '../Loading';
import { getTestingFilters } from '../../redux/actions/testingFilter/getTestingFilters.action';
import { createTestingFilter } from '../../redux/actions/testingFilter/createTestingFilter.action';
import { getPosts } from '../../redux/actions/post/getPosts.action';
import NumberFormat from 'react-number-format';
import moment from 'moment';

import { getSubdivisions } from '../../redux/actions/subdivision/getSubdivisions.action';
import axios from 'axios';
import { getSubdivisionsWithPosts } from '../../redux/actions/subdivision/getSubdivisionWithPosts.action';
import { getCatsByPostAndSubdiv } from '../../redux/actions/category/getCatsByPostAndSubdiv';
import { resetGetSubdivisionsByPosts, resetGetSubdivisionsWithPosts } from '../../redux/slices/subdivision.slice';
import { resetGetCatsByPostAndSubdiv } from '../../redux/slices/category.slice';
import { createTesting } from '../../redux/actions/testing/createTesting.action';
import { resetGetAdminTestingSingle } from '../../redux/slices/testing.slice';
import { updateTesting } from '../../redux/actions/testing/updateTesting.action';
import { resetCreateTestingFilter } from '../../redux/slices/testingFilter.slice';
import { getSubdivisionsByPosts } from '../../redux/actions/subdivision/getSubdivisionsByPosts.action';
import { resetGetPosts } from '../../redux/slices/post.slice';
const ModalTesting = () => {
  const [successCreateTestingFilter, setSuccessCreateTestingFilter] = useState(false);
  const defaultValues = {
    name: '',
    desc: '',
    dateEnd: '',
    dateStart: '',
    linkTest: '',
    catIds: [],
    postsIds: [],
  };
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
    getValues,
    reset,
    resetField,
    setError,
    clearErrors,
  } = useForm({ defaultValues });
  const filterForm = useForm({
    deafultValues: {
      name: '',
    },
  });
  const [viewPosts, setViewPosts] = useState([]);
  const [viewCats, setViewCats] = useState([]);
  const {
    getPosts: { data: posts, loading: postsLoading },
  } = useSelector((state) => state.post);
  const {
    getCatsByPostAndSubdiv: { data: categories, loading: categoriesLoading },
  } = useSelector((state) => state.category);
  const {
    getTestingFilters: { data: testingFilters, loading: testingFiltersLoading },
    createTestingFilter: { data: createTestingFilterData, loading: createTestingFilterLoading },
  } = useSelector((state) => state.testingFilter);
  const {
    getSubdivisions: { data: subdivisions, loading: subdivisionsLoading },
    getSubdivisionsWithPosts: { data: subdivisionPosts, loading: subdivisionPostsLoading },
    getSubdivisionsByPosts: { data: subdivisionByPosts, loading: subdivisionByPostsLoading },
  } = useSelector((state) => state.subdivision);
  const [isInitCats, setIsInitCats] = useState(true);
  const {
    getAdminTestingSingle: { data: testingSingle, loading: testingSingleLoading },
  } = useSelector((state) => state.testing);
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    if (testingSingle) {
      dispatch(updateTesting({ ...data, id: testingSingle?.id }));
    } else {
      dispatch(createTesting(data));
    }
    reset();
    dispatch(setActiveModal(''));
  };
  useEffect(() => {
    if (posts?.length !== 0 && posts) {
      const viewPostsArr = posts?.map((cat) => ({ label: cat?.name, value: cat?.id }));

      if (testingSingle) {
        const activePosts = viewPostsArr.map((viewPost) => (testingSingle?.posts?.find((postActive) => postActive == viewPost?.value) ? viewPost?.value.toString() : false));

        setValue('postsIds', activePosts);
      }
      setViewPosts(viewPostsArr);
    } else {
      setViewPosts([]);
    }
  }, [posts, testingSingle]);
  useEffect(() => {
    if (subdivisionByPosts?.length !== 0 && subdivisionByPosts) {
      let viewCatsArr = [];
      let lastCatsVal = getValues('catIds')?.filter((val) => val);
      let updateCatsVal = [];
      subdivisionByPosts.map((subdivPost) => {
        subdivPost?.categories.map((subdivCat) => {
          viewCatsArr.push({ label: subdivCat?.name, value: subdivCat?.id });
          updateCatsVal.push(lastCatsVal?.find((val) => val == subdivCat?.id) ? subdivCat?.id.toString() : false);
        });
      });
      setViewCats(viewCatsArr);
      console.log(updateCatsVal);
      setValue('catIds', updateCatsVal);
    } else {
      setViewCats([]);
    }
  }, [subdivisionByPosts, testingSingle]);

  useEffect(() => {
    if (viewCats?.length !== 0 && testingSingle && isInitCats) {
      const activeCats = viewCats.map((viewCat) => (testingSingle?.cats?.find((catActive) => catActive == viewCat?.value) ? viewCat?.value.toString() : false));

      setValue('catIds', activeCats);
      setIsInitCats(false);
    }
  }, [viewCats]);

  useEffect(() => {
    if (createTestingFilterData) {
      dispatch(getTestingFilters());
      filterForm.setValue('name', '');
      setSuccessCreateTestingFilter(true);
      setTimeout(() => {
        setSuccessCreateTestingFilter(false);
      }, 3000);
      dispatch(resetCreateTestingFilter());
    }
  }, [createTestingFilterData]);

  useEffect(() => {
    dispatch(getSubdivisions());
    dispatch(getTestingFilters());
    dispatch(getPosts());
    return () => {
      dispatch(resetGetPosts());
      dispatch(resetGetSubdivisionsByPosts());
      dispatch(resetGetAdminTestingSingle());
    };
  }, []);

  useEffect(() => {
    if (testingSingle) {
      setValue('name', testingSingle?.name);
      setValue('desc', testingSingle?.desc);
      setValue('dateEnd', moment(testingSingle?.dateEnd).format('DD.MM.YYYY'));
      setValue('dateStart', moment(testingSingle?.dateStart).format('DD.MM.YYYY'));
      setValue('linkTest', testingSingle?.linkTest);
      setValue('testingFilterId', testingSingle?.testingFilterId);
      // if (testingSingle?.posts?.length !== 0 && testingSingle?.posts?.length) {
      //   dispatch(getSubdivisionsByPosts(testingSingle?.posts));
      // }
    }
  }, [testingSingle]);
  const onAddTestingFilter = (data) => {
    dispatch(createTestingFilter({ name: data?.name }));
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name?.includes('postsIds') && value?.postsIds) {
        const selectedPosts = value?.postsIds.filter((postId) => postId);

        dispatch(getSubdivisionsByPosts(selectedPosts));
      }
      //DATE START VALIDE
      const dateEndFormatStart = moment(value?.dateStart, 'DD.MM.YYYY');
      var startDateStart = moment('01.01.2022', 'DD.MM.YYYY');
      var endDateStart = moment(value?.dateEnd ? value?.dateEnd : '01.01.2025', 'DD.MM.YYYY');
      const isValidDateStart = dateEndFormatStart.isValid();
      const isBetweenDateStart = dateEndFormatStart.isBetween(startDateStart, endDateStart);
      if (!isValidDateStart || !isBetweenDateStart) {
        setError('dateStart', { type: 'invalidDate' });
      } else {
        clearErrors('dateStart');
      }
      //DATE END VALIDE
      const dateEndFormat = moment(value?.dateEnd, 'DD.MM.YYYY');
      var startDate = moment(value?.dateStart ? value?.dateStart : new Date(), 'DD.MM.YYYY', 'DD.MM.YYYY');
      var endDate = moment('01.01.2025', 'DD.MM.YYYY');
      const isValidDate = dateEndFormat.isValid();
      const isBetweenDate = dateEndFormat.isBetween(startDate, endDate);
      if (!isValidDate || !isBetweenDate) {
        setError('dateEnd', { type: 'invalidDate' });
      } else {
        clearErrors('dateEnd');
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <>
      <Modal title="Добавление тестирование" onSave={handleSubmit(onSubmit)} onClose={() => {}}>
        <div style={{ minHeight: '400px', position: 'relative' }}>
          {!testingSingleLoading ? (
            <div>
              <input type="text" placeholder="Заголовок теста" {...register('name', { required: true, maxLength: 40 })} />
              <div className="date">
                <div className="date__wrap">
                  <div className="date__title">от:</div>
                  <Controller
                    control={control}
                    name={'dateStart'}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, name, value } }) => <NumberFormat format="##.##.####" mask="_" name={name} value={value} placeholder={'01.01.2022'} onChange={onChange} autoComplete="off" />}
                  />
                </div>

                <div className="date__wrap">
                  <div className="date__title">до:</div>
                  <Controller
                    control={control}
                    name={'dateEnd'}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, name, value } }) => <NumberFormat format="##.##.####" mask="_" name={name} value={value} placeholder={'01.01.2022'} onChange={onChange} autoComplete="off" />}
                  />
                </div>
              </div>
              <textarea placeholder="Краткое описание" rows="3" {...register('desc', { required: true })}></textarea>
              <input
                type="text"
                placeholder="Ссылка на тест"
                {...register('linkTest', {
                  required: true,
                  pattern: {
                    value: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                    message: 'invalid url',
                  },
                })}
              />
              <div className="" style={{ marginBottom: '20px' }}>
                <CheckboxGroup control={control} disabled={subdivisionByPostsLoading} name="postsIds" list={viewPosts} register={register} />
              </div>
              <div className="" style={{ marginBottom: '20px' }}>
                <CheckboxGroup control={control} disabled={subdivisionByPostsLoading} name="catIds" list={viewCats} register={register} />
              </div>
              <div className="modal__select">
                <select {...register('testingFilterId', { required: true })}>
                  <option value={''} selected>
                    Выберите фильтр
                  </option>
                  {testingFilters?.map((newFilter) => {
                    return <option value={newFilter?.id}>{newFilter?.name}</option>;
                  })}
                </select>
              </div>{' '}
              <div class="text-error" style={{ marginBottom: '10px' }}>
                {filterForm.formState?.errors?.name && 'Введите название фильтра'}
              </div>
              <div class="text-success" style={{ marginBottom: '10px' }}>
                {successCreateTestingFilter && 'Фильтр добавлен'}
              </div>
              <div className="modal__create">
                <input type="text" placeholder="Добавить фильтр" {...filterForm.register('name', { required: true })} autoComplete="off" />

                <button onClick={filterForm.handleSubmit(onAddTestingFilter)} disabled={successCreateTestingFilter}>
                  <img src="/img/modal/plus.svg" />
                </button>
              </div>
              <div
                class="text-error"
                style={{
                  marginBottom: '20px',
                }}>
                {' '}
                {Object.keys(errors).length !== 0 && 'Заполните следующие поля:'}
                <div>{errors?.dateStart && '- Неверный формат даты начала'}</div>
                <div>{errors?.dateEnd && '- Неверный формат даты окончания'}</div>
                <div>{errors?.name && '- Заголовок'}</div>
                <div>{errors?.desc && '- Краткое описание'}</div> <div>{errors?.linkTest && '- Ссылка на тест'}</div>
                <div>{errors?.subdivisionId && '- Подразделение'}</div> <div>{errors?.postId && '- Должность'}</div> <div>{errors?.categoryId && '- Категория'}</div>
              </div>
            </div>
          ) : (
            <Loading />
          )}
          {false && <Loading style={{ top: 'auto', bottom: '54px', transform: 'translate(-50%, -50%) scale(50%)' }} />}
        </div>
      </Modal>
    </>
  );
};

export default ModalTesting;
