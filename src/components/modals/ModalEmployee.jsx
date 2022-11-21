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
import { resetCreateCategory, resetGetCatsByPostAndSubdiv } from '../../redux/slices/category.slice';
import { createTesting } from '../../redux/actions/testing/createTesting.action';
import { formatPhone } from '../../utils/formatPhone';
import { createCategory } from '../../redux/actions/category/createCategory';
import { updateEmployee } from '../../redux/actions/employee/updateEmployee.action';
import { resetGetEmployee } from '../../redux/slices/employee.slice';
const ModalEmployee = () => {
  const [successCreateNewsFilter, setSuccessCreateNewsFilter] = useState(false);
  const [viewCategories, setViewCategories] = useState([]);
  const defaultValues = {
    id: '',
    coefficient: '',
    categoryPostSubdivisionIds: [],
    subdivisionId: '',
  };
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
    setValue,
    getValues,
    setError,
    clearErrors,
  } = useForm({ defaultValues });
  const categoryForm = useForm({
    deafultValues: {
      name: '',
      postId: '',
      subdivisionId: '',
    },
  });

  const dispatch = useDispatch();
  const {
    getCatsByPostAndSubdiv: { data: categories, loading: categoriesLoading },
  } = useSelector((state) => state.category);
  const {
    getEmployee: { data: employee, loading: employeeLoading },
  } = useSelector((state) => state.employee);
  const {
    createCategory: { data: createCategoryData, loading: createCategoryLoading },
  } = useSelector((state) => state.category);

  const onSubmit = (data) => {
    const catIds = data?.categoryPostSubdivisionIds?.filter((post) => post);
    const newData = { ...data, categoryPostSubdivisionIds: catIds };

    dispatch(updateEmployee(newData));
    resetModelEmployee();
  };
  const resetModelEmployee = () => {
    dispatch(resetGetCatsByPostAndSubdiv());
    dispatch(resetGetEmployee());
    dispatch(setActiveModal(''));
    reset();
    setValue('id', '');
    setValue('coefficient', '');
    setValue('subdivisionId', '');
    setValue('categoryPostSubdivisionIds', []);
  };

  useEffect(() => {
    if (categories?.categories?.length !== 0 && categories?.categories) {
      const viewCats = categories?.categories?.map((cat) => ({ label: cat?.name, value: cat?.id }));

      if (getValues('categoryPostSubdivisionIds')?.length === 0) {
        const activeCats = viewCats.map((viewCat) => {
          let isActiveCat = false;
          const findCatInEmployee = employee?.categories?.find((findCat) => findCat?.id == viewCat?.value && findCat?.categoryEmployee?.active === '1');
          if (findCatInEmployee) {
            isActiveCat = viewCat?.value.toString();
          }
          return isActiveCat;
        });
        setValue('categoryPostSubdivisionIds', activeCats);
      }
      setViewCategories(viewCats);
    } else {
      setValue('categoryPostSubdivisionIds', []);
      setViewCategories([]);
    }
  }, [categories]);

  useEffect(() => {
    if (employee) {
      setValue('coefficient', employee?.coefficient);
      setValue('id', employee?.idService);
      setValue('postSubdivisionId', employee?.postSubdivisionId);
      categoryForm.setValue('postId', employee?.postSubdivision?.postId);
      categoryForm.setValue('subdivisionId', employee?.postSubdivision?.subdivisionId);
      dispatch(getCatsByPostAndSubdiv({ postId: employee?.postSubdivision?.postId, subdivisionId: employee?.postSubdivision?.subdivisionId }));
    }
  }, [employee]);

  useEffect(() => {
    dispatch(getSubdivisions());
  }, []);
  useEffect(() => {
    if (createCategoryData) {
      setSuccessCreateNewsFilter(true);
      dispatch(getCatsByPostAndSubdiv({ postId: employee?.postSubdivision?.postId, subdivisionId: employee?.postSubdivision?.subdivisionId }));
      categoryForm.setValue('name', '');
      setTimeout(() => {
        setSuccessCreateNewsFilter(false);
      }, 3000);
      dispatch(resetCreateCategory());
    }
  }, [createCategoryData]);
  // const watchCategories = watch('categoryPostSubdivisionIds');
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value?.categoryPostSubdivisionIds?.filter((watchPost) => watchPost)?.length === 0) {
        setError('categoryPostSubdivisionIds', { type: 'emptyPosts' });
      } else {
        clearErrors('categoryPostSubdivisionIds');
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);
  const onAddNewsCategory = (data) => {
    dispatch(createCategory(data));
    console.log(data);
  };
  console.log(errors);
  return (
    <>
      <Modal
        title="Добавление "
        onSave={handleSubmit(onSubmit)}
        onClose={() => {
          resetModelEmployee();
        }}>
        <div style={{ minHeight: '300px', position: 'relative' }}>
          <div style={{ visibility: !employeeLoading && !categoriesLoading ? 'visible' : 'hidden' }}>
            <input type="text" value={employee?.idService} disabled={true} />
            <input type="text" value={employee?.firstName} disabled={true} /> <input type="text" value={employee?.lastName} disabled={true} />
            <input type="text" value={employee?.patronymicName} placeholder="Отчество" disabled={true} /> <input type="text" value={formatPhone(employee?.tel)} placeholder="Отчество" disabled={true} />
            <input type="text" value={employee?.post} placeholder="Отчество" disabled={true} />
            <input type="text" value={employee?.subdivision} placeholder="Отчество" disabled={true} />
            <input type="number" {...register('coefficient', { required: true })} placeholder="Коэфициэнт" />
            <div className="" style={{ marginBottom: '20px' }}>
              <CheckboxGroup name="categoryPostSubdivisionIds" list={viewCategories} register={register} />
            </div>
            <div class="text-success" style={{ marginBottom: '10px' }}>
              {successCreateNewsFilter && 'Фильтр добавлен'}
            </div>
            <div className="modal__create">
              <input type="text" placeholder="Добавить фильтр" {...categoryForm.register('name', { required: true })} autoComplete="off" />

              <button onClick={categoryForm.handleSubmit(onAddNewsCategory)} disabled={successCreateNewsFilter}>
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
              <div>{errors?.categoryPostSubdivisionIds && '- Категории'}</div>
              <div>{errors?.coefficient && '- Коэффицент'}</div>
            </div>
          </div>

          {createCategoryLoading && <Loading empty style={{ top: 'auto', bottom: '54px', transform: 'translate(-50%, -50%) scale(50%)' }} />}
        </div>
        {!(!employeeLoading && !categoriesLoading) && <Loading empty />}
      </Modal>
    </>
  );
};

export default ModalEmployee;
