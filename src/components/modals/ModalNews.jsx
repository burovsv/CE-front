import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router';
import clsx from 'clsx';
import Modal from './Modal';
import { setActiveModal } from '../../redux/slices/app.slice';
import { Editor } from 'react-draft-wysiwyg';
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js';
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
import { resetGetAdminNewsSingle } from '../../redux/slices/news.slice';
import { updateNews } from '../../redux/actions/news/updateNews.action';
import { resetCreateNewsFilter } from '../../redux/slices/newsFilter.slice';
import { getSubdivisionsByPosts } from '../../redux/actions/subdivision/getSubdivisionsByPosts.action';
import { resetGetSubdivisionsByPosts } from '../../redux/slices/subdivision.slice';
import { resetGetPosts } from '../../redux/slices/post.slice';
import { useSearchParams } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CustomToolbar from '../CustomToolbar';
const ModalNews = () => {
  const [isInitCats, setIsInitCats] = useState(true);
  const [viewCats, setViewCats] = useState([]);
  const [viewCategories, setViewCategories] = useState([]);
  const [successCreateNewsFilter, setSuccessCreateNewsFilter] = useState(false);
  const [searchParams] = useSearchParams();

  const defaultValues = {
    title: '',
    image: '',
    desc: '',
    descShort: '',
    newsFilterId: '',
    newsTypeId: searchParams.get('study') ? 2 : 1,
    posts: [],
    dateEnd: '',
    dateStart: '',
    datePublish: '',
    timeStart: '',
    timeEnd: '',
    timePublish: '',
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

  const filterForm = useForm({
    deafultValues: {
      name: '',
    },
  });
  const {
    getPosts: { data: posts, loading: postsLoading },
  } = useSelector((state) => state.post);
  const {
    getNewsTypes: { data: newsTypes, loading: newsTypesLoading },
  } = useSelector((state) => state.newsType);
  const {
    getNewsFilters: { data: newsFilters, loading: newsFiltersLoading },
    createNewsFilter: { data: createNewsFilterData, loading: createNewsFilterLoading },
  } = useSelector((state) => state.newsFilter);
  const {
    getSubdivisionsByPosts: { data: subdivisionByPosts, loading: subdivisionByPostsLoading },
  } = useSelector((state) => state.subdivision);
  const {
    getAdminNewsSingle: { data: singleNews, loading: singleNewsLoading },
  } = useSelector((state) => state.news);
  const dispatch = useDispatch();
  // const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [postCheckboxView, setPostCheckboxView] = useState([]);
  // const [convertedContent, setConvertedContent] = useState(null);
  // const handleEditorChange = (state) => {
  //   setEditorState(state);
  //   convertContentToHTML();
  // };
  // const convertContentToHTML = () => {
  //   let currentContentAsHTML = convertToHTML({
  //     blockToHTML: (b) => {
  //       console.log(b.type);
  //       if (b.type === 'atomic') {
  //         return {
  //           start: '<figure>',
  //           end: '</figure><br/>',
  //           empty: '',
  //         };
  //       }

  //       return;
  //     },
  //     entityToHTML: (entity, originalText) => {
  //       console.log(entity.type);
  //       console.log('ENTITY TO HTML');
  //       if (entity.type === 'LINK') {
  //         return <a href={entity.data['url']}>{originalText}</a>;
  //       }

  //       if (entity.type === 'IMAGE') {
  //         console.log(entity.data);
  //         return { start: `<img src='${entity.data['src']}' height='${entity.data['height']}' style='width: 100%;' width='${entity.data['width']}'/>`, end: '', empty: '' };
  //       }

  //       return originalText;
  //     },
  //   })(editorState.getCurrentContent());

  //   setValue('desc', currentContentAsHTML);
  // };
  const covertNewsToFormData = ({ title, image, desc, descShort, newsFilterId, newsTypeId, posts, dateEnd, datePublish, timeEnd, timeStart, timePublish, dateStart, catIds }) => {
    const postIds = posts?.filter((post) => post).map((postId) => parseInt(postId));
    const catIdsInt = catIds?.filter((cat) => cat).map((catId) => parseInt(catId));
    return {
      title,
      desc,
      descShort,
      dateEnd,
      timeEnd,
      dateStart,
      timeStart,
      datePublish,
      timePublish,
      newsTypeId,
      image,
      filterId: newsFilterId,
      postIds,
      catIds: catIdsInt,
    };
  };

  const onSubmit = (data) => {
    console.log(data);
    const formData = new FormData();
    const formatData = covertNewsToFormData(data);
    Object.keys(formatData).map(function (key, index) {
      formData.append(key, formatData[key]);
    });

    if (singleNews) {
      formData.append('id', singleNews?.id);
      dispatch(updateNews(formData));
    } else {
      dispatch(createNews(formData));
    }

    dispatch(setActiveModal(''));
  };

  useEffect(() => {
    dispatch(getNewsTypes());
    dispatch(getNewsFilters());
    dispatch(getPosts());
    register('desc');
    register('image');
    return () => {
      dispatch(resetGetPosts());
      dispatch(resetGetSubdivisionsByPosts());
    };
  }, []);

  useEffect(() => {
    if (createNewsFilterData) {
      dispatch(getNewsFilters());
      filterForm.setValue('name', '');
      setSuccessCreateNewsFilter(true);
      setTimeout(() => {
        setSuccessCreateNewsFilter(false);
      }, 3000);
      dispatch(resetCreateNewsFilter());
    }
  }, [createNewsFilterData]);

  const newsTypeId = watch('newsTypeId');
  const watchImage = watch('image');

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name?.includes('posts') && value?.posts) {
        const selectedPosts = value?.posts.filter((postId) => postId);

        dispatch(getSubdivisionsByPosts(selectedPosts));
      }
      if (value?.newsTypeId == 1) {
        if (!value?.image && !singleNews?.image) {
          setError('image', { type: 'emptyImage' });
        }
      } else {
        clearErrors('image');
      }

      if (value?.posts?.filter((watchPost) => watchPost)?.length === 0) {
        setError('posts', { type: 'emptyPosts' });
      } else {
        clearErrors('posts');
      }
      if (value?.newsTypeId == 1) {
        const dateEndFormat = moment(value?.dateEnd, 'DD.MM.YYYY');
        var startDate = moment(new Date(), 'DD.MM.YYYY');
        var endDate = moment('01.01.2025', 'DD.MM.YYYY');
        const isValidDate = dateEndFormat.isValid();
        const isBetweenDate = dateEndFormat.isBetween(startDate, endDate);
        console.log();
        if (!isValidDate || !isBetweenDate) {
          setError('dateEnd', { type: 'invalidDate' });
        } else {
          clearErrors('dateEnd');
        }
      } else {
        clearErrors('dateEnd');
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);
  // useEffect(() => {
  //   if (newsTypes?.length !== 0) {
  //     setValue('newsFilterId', newsFilters?.filter((newsFilter) => newsFilter?.newsTypeId == getValues('newsTypeId'))[0]?.id);
  //   }
  // }, [newsTypes]);
  const onAddNewsFilter = (data) => {
    dispatch(createNewsFilter({ name: data?.name, newsTypeId: getValues('newsTypeId') }));
  };
  useEffect(() => {
    if (posts?.length !== 0) {
      const postsView = posts?.map(({ name, id }) => ({ label: name, value: id }));
      setPostCheckboxView(postsView);
    }
  }, [posts]);

  const [prevImage, setPrevImage] = useState();
  const onImageChange = (e) => {
    const [file] = e.target.files;
    setPrevImage(URL.createObjectURL(file));
    setValue('image', file);
  };
  const hiddenFileInput = React.useRef(null);
  const onClickUpload = () => {
    hiddenFileInput.current.click();
  };
  useEffect(() => {
    if (singleNews && postCheckboxView?.length !== 0 && newsFilters?.length !== 0) {
      let currentPosts = [];
      // if (singleNews?.newsFilter?.newsTypeId == 1) {
      setValue('dateEnd', moment(singleNews?.dateEnd).format('DD.MM.YYYY'));
      setValue('timeEnd', moment(singleNews?.dateEnd).format('HH:mm'));
      setValue('timeStart', moment(singleNews?.dateStart).format('HH:mm'));
      setValue('timePublish', moment(singleNews?.datePublish).format('HH:mm'));
      setValue('dateStart', moment(singleNews?.dateStart).format('DD.MM.YYYY'));
      setValue('datePublish', moment(singleNews?.datePublish).format('DD.MM.YYYY'));
      // }

      setValue('title', singleNews?.title);
      setValue('descShort', singleNews?.descShort);
      if (singleNews?.desc) {
        setText(singleNews?.desc);
        setValue('desc', singleNews?.desc);
      }

      setValue('newsTypeId', singleNews?.newsFilter?.newsTypeId);

      setValue('newsFilterId', singleNews?.newsFilterId);
      currentPosts = posts?.map((postItem) => {
        const findNewsPost = singleNews?.posts.find((postFind) => postFind?.id == postItem?.id);
        if (findNewsPost) {
          return postItem?.id;
        }
        return false;
      });
      setValue('posts', currentPosts);
    }
  }, [singleNews, postCheckboxView, newsFilters]);

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

      setValue('catIds', updateCatsVal);
    } else {
      setViewCats([]);
    }
  }, [subdivisionByPosts, singleNews]);
  useEffect(() => {
    if (viewCats?.length !== 0 && singleNews && isInitCats) {
      const activeCats = viewCats.map((viewCat) => (singleNews?.categories?.find((catActive) => catActive?.id == viewCat?.value && catActive?.newsCategory?.active === '1') ? viewCat?.value.toString() : false));

      setValue('catIds', activeCats);
      setIsInitCats(false);
    }
  }, [viewCats]);

  const [text, setText] = useState('');

  const handleChange = (html) => {
    setText(html);
    setValue('desc', html);
  };
  function imageHandler() {
    var range = this.quill.getSelection();
    var valuee = prompt('please copy paste the image url here.');
    if (valuee) {
      this.quill.insertEmbed(range.index, 'image', valuee, Quill.sources.USER);
    }
  }

  const formats = ['font', 'size', 'bold', 'italic', 'underline', 'strike', 'color', 'background', 'script', 'header', 'blockquote', 'code-block', 'indent', 'list', 'direction', 'align', 'link', 'image', 'video', 'formula'];
  const modules = useMemo(
    () => ({
      toolbar: {
        container: '#toolbar',

        handlers: {
          image: imageHandler,
        },
      },
    }),
    [],
  );
  return (
    <>
      <Modal
        title="Добавление тестирование"
        onSave={handleSubmit(onSubmit)}
        disabled={newsFiltersLoading}
        onClose={() => {
          dispatch(resetGetAdminNewsSingle());
        }}>
        <div style={{ minHeight: '300px', position: 'relative' }}>
          {!newsTypesLoading && !postsLoading && !singleNewsLoading ? (
            <div>
              {/* <div className="modal__select">
                <select placeholder="Должность" disabled={singleNews} {...register('newsTypeId', { required: true })}>
                  {newsTypes?.map(({ name, id }) => (
                    <option value={id}>{name}</option>
                  ))}
                </select>
              </div> */}
              {newsTypeId == '1' ? (
                <>
                  {(watchImage && prevImage) || singleNews?.image ? (
                    <div className="upload-image">
                      <img src={prevImage || `${process.env.REACT_APP_SERVER_URL}/images/${singleNews?.image}`} />
                    </div>
                  ) : (
                    <>
                      <div className="upload" onClick={() => onClickUpload()}>
                        <img src="/img/modal/image.svg" />
                      </div>
                    </>
                  )}
                  <input type="file" onChange={onImageChange} style={{ display: 'none' }} ref={hiddenFileInput} />
                  <button className="modal__btn" style={{ marginBottom: '20px', marginTop: '10px' }} onClick={() => onClickUpload()}>
                    {(watchImage && prevImage) || singleNews?.image ? 'Изменить картинку' : 'Загрузить картинку'}
                  </button>
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
                </>
              ) : (
                <div className="date-study">
                  <div className="date">
                    <div className="date__wrap">
                      <div className="date__title">Публикация:</div>
                      <Controller
                        control={control}
                        name={'datePublish'}
                        rules={{
                          required: true,
                        }}
                        render={({ field: { onChange, name, value } }) => <NumberFormat format="##.##.####" mask="_" name={name} value={value} placeholder={'01.01.2022'} onChange={onChange} autoComplete="off" />}
                      />
                    </div>

                    <div className="date__wrap" style={{ maxWidth: '130px' }}>
                      <div className="date__title">Время:</div>
                      <Controller
                        control={control}
                        name={'timePublish'}
                        rules={{
                          required: true,
                        }}
                        render={({ field: { onChange, name, value } }) => <NumberFormat format="##:##" mask="_" name={name} value={value} placeholder={'12:00'} onChange={onChange} autoComplete="off" />}
                      />
                    </div>
                  </div>
                  <div className="date">
                    <div className="date__wrap">
                      <div className="date__title">Начало:</div>
                      <Controller
                        control={control}
                        name={'dateStart'}
                        rules={{
                          required: true,
                        }}
                        render={({ field: { onChange, name, value } }) => <NumberFormat format="##.##.####" mask="_" name={name} value={value} placeholder={'01.01.2022'} onChange={onChange} autoComplete="off" />}
                      />
                    </div>

                    <div className="date__wrap" style={{ maxWidth: '130px' }}>
                      <div className="date__title">Время:</div>
                      <Controller
                        control={control}
                        name={'timeStart'}
                        rules={{
                          required: true,
                        }}
                        render={({ field: { onChange, name, value } }) => <NumberFormat format="##:##" mask="_" name={name} value={value} placeholder={'12:00'} onChange={onChange} autoComplete="off" />}
                      />
                    </div>
                  </div>
                  <div className="date">
                    <div className="date__wrap">
                      <div className="date__title">Окончание:</div>
                      <Controller
                        control={control}
                        name={'dateEnd'}
                        rules={{
                          required: true,
                        }}
                        render={({ field: { onChange, name, value } }) => <NumberFormat format="##.##.####" mask="_" name={name} value={value} placeholder={'01.01.2022'} onChange={onChange} autoComplete="off" />}
                      />
                    </div>

                    <div className="date__wrap" style={{ maxWidth: '130px' }}>
                      <div className="date__title">Время:</div>
                      <Controller
                        control={control}
                        name={'timeEnd'}
                        rules={{
                          required: true,
                        }}
                        render={({ field: { onChange, name, value } }) => <NumberFormat format="##:##" mask="_" name={name} value={value} placeholder={'12:00'} onChange={onChange} autoComplete="off" />}
                      />
                    </div>
                  </div>
                </div>
              )}
              <input type="text" placeholder="Заголовок новости" {...register('title', { required: true, maxLength: 40 })} />
              <textarea placeholder="Краткое описание" rows="3" {...register('descShort', { required: true, maxLength: 100 })}></textarea>
              <CustomToolbar />
              <ReactQuill value={text} onChange={handleChange} modules={modules} formats={formats} defaultValue={''} />
              {/* <Editor
                defaultEditorState={editorState}
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                editorClassName="modal__editor"
                toolbar={{ options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'], history: { inDropdown: true } }}
              />{' '} */}
              <div className="modal__select">
                <select {...register('newsFilterId', { required: true })}>
                  <option value={''} selected>
                    Выберите фильтр
                  </option>
                  {newsFilters?.map((newFilter) => {
                    if (newsTypeId == newFilter?.newsTypeId) {
                      return <option value={newFilter?.id}>{newFilter?.name}</option>;
                    }
                  })}
                </select>
              </div>{' '}
              <div class="text-error" style={{ marginBottom: '10px' }}>
                {filterForm.formState?.errors?.name && 'Введите название фильтра'}
              </div>
              <div class="text-success" style={{ marginBottom: '10px' }}>
                {successCreateNewsFilter && 'Фильтр добавлен'}
              </div>
              <div className="modal__create">
                <input type="text" placeholder="Добавить фильтр" {...filterForm.register('name', { required: true })} autoComplete="off" />

                <button onClick={filterForm.handleSubmit(onAddNewsFilter)} disabled={successCreateNewsFilter}>
                  <img src="/img/modal/plus.svg" />
                </button>
              </div>
              <div className="">
                <CheckboxGroup name="posts" disabled={subdivisionByPostsLoading} list={postCheckboxView} register={register} />
              </div>
              {newsTypeId == '2' && (
                <div className="" style={{ marginTop: '20px' }}>
                  <CheckboxGroup control={control} disabled={subdivisionByPostsLoading} name="catIds" list={viewCats} register={register} />
                </div>
              )}
              <div
                class="text-error"
                style={{
                  marginTop: '20px',
                  marginBottom: '20px',
                }}>
                {' '}
                {Object.keys(errors).length !== 0 && 'Заполните следующие поля:'}
                <div>{errors?.image && '- Загрузите изображение'}</div>
                <div>{errors?.dateEnd && '- Неверный формат даты'}</div>
                <div>{errors?.title && '- Заголовок'}</div>
                <div>{errors?.descShort && '- Краткое описание'}</div>
                <div>{errors?.desc && '- Полное описание'}</div>
                <div>{errors?.newsFilterId && '- Фильтр'}</div>
                <div>{errors?.posts && '- Должности'}</div>
              </div>
            </div>
          ) : (
            <Loading />
          )}
          {(createNewsFilterLoading || newsFiltersLoading || singleNewsLoading) && <Loading empty style={{ top: 'auto', bottom: '54px', transform: 'translate(-50%, -50%) scale(50%)' }} />}
        </div>
      </Modal>
    </>
  );
};

export default ModalNews;
