import React, { useEffect, useState, useMemo } from 'react';

import { Select, Collapse } from 'antd';
import * as _ from 'lodash';

import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import CustomToolbar from '../CustomToolbar';

import { setActiveModal } from '../../redux/slices/app.slice';

import { resetCreateMark } from '../../redux/slices/mark.slice';
import { createMark } from '../../redux/actions/knowledgeBase/createMark.action';
import { getMarks } from '../../redux/actions/knowledgeBase/getMarks.action';

import { resetCreateSectionGroup } from '../../redux/slices/sectionGroup.slice';
import { createSectionGroup } from '../../redux/actions/knowledgeBase/createSectionGroup.action';
import { getSectionGroups } from '../../redux/actions/knowledgeBase/getSectionGroups.action';

import { resetCreateSection } from '../../redux/slices/section.slice';
import { getSectionsByGroup } from '../../redux/actions/knowledgeBase/getSectionsByGroup.action';
import { createSection } from '../../redux/actions/knowledgeBase/createSection.action';

import { uploadArticleFile } from '../../redux/actions/knowledgeBase/uploadArticleFile.action';
import { uploadArticleImage } from '../../redux/actions/knowledgeBase/uploadArticleImage.action';

// import { getEmployeePositions } from '../../redux/actions/employeePosition/getEmployeePositions.action';
import { getPosts } from '../../redux/actions/post/getPosts.action';

// создание статьи
import { createArticle } from '../../redux/actions/knowledgeBase/createArticle.action';

import ReactQuill, { Quill } from 'react-quill';
// import { create } from 'domain';
import * as mammoth from 'mammoth/mammoth.browser.js';

const { Panel } = Collapse;

const ModalArticle = () => {

    const [articleName, setArticleName] = useState('');
    const [articleSection, setArticleSection] = useState('');
    const [articleSectionGroup, setArticleSectionGroup] = useState('');
    const [articleDesc, setArticleDesc] = useState('');

    const [successCreateMark, setSuccessCreateMark] = useState(false)
    const [successCreateSection, setSuccessCreateSection] = useState(false)
    const [successCreateSectionGroup, setSuccessCreateSectionGroup] = useState(false)

    // Для добавления новых эл-ов в бд
    const [newMark, setNewMark] = useState('');
    const [newSectionGroup, setNewSectionGroup] = useState('');
    const [newSection, setNewSection] = useState('');

    // вывод ошибок
    const [errorCreateMark, setErrorCreateMark] = useState(false)
    const [errorCreateSectionGroup, setErrorCreateSectionGroup] = useState(false)
    const [errorCreateSection, setErrorCreateSection] = useState(false)

    const [optionsPosts, setOptionsPosts] = useState([]);
    const [optionsMarks, setOptionsMarks] = useState([]);
    const [optionsSectionGroups, setOptionsSectionGroups] = useState([]);
    const [optionsSections, setOptionsSections] = useState([]);

    const [textFilesList, setTextFilesList] = useState([]);
    const [textFileName, setTextFileName] = useState('');

    const [videoFileUrl, setVideoFileUrl] = useState('');
    const [videoFileName, setVideoFileName] = useState('');
    const [videoFileDesc, setVideoFileDesc] = useState('');
    const [videoFilesList, setVideoFilesList] = useState([]);

    const [imageUrl, setImageUrl] = useState('');

    // MAMMOTH
        
    const h1 = new RegExp("<(S*?)[^>]*>.*?</1>|<.*?/>");

    function parseWordDocxFile(inputElement) {
        var files = inputElement.files || [];
        if (!files.length) return;
        var file = files[0]; // solo el 1er archivo
    
        console.time();
        var reader = new FileReader();
        reader.onloadend = function (event) {
          var arrayBuffer = reader.result;
          // debugger
    
          mammoth
            .convertToHtml({ arrayBuffer: arrayBuffer })
            .then(function (resultObject) {
              let rendered = resultObject.value;
              setArticleDesc(rendered);
            });
          console.timeEnd();
        }
        reader.readAsArrayBuffer(file);
    }

    const defaultValues = {
        name: '',
        date: '',
        section: '',
        mark: [],
        employeePosition: '',
        content: '',
    }

    const {
        control,
        formState: { errors },
        getValues,
        register,
        setValue
    } = useForm({ defaultValues });


    // получить список групп, разделов, должностей, меток
    const {
        getMarks: { data: marks, loading: loadingMarks },
        createMark: { data: createMarkData, loading: createMarkLoading },
    } = useSelector((state) => state.mark);

    const {
        getSectionsByGroup: { data: sections, loading: loadingSection, error: errorSection, count: sectionCount },
        createSection: { data: createSectionData, loading: createSectionLoading },
    } = useSelector((state) => state.section);

    const {
        getSectionGroups: { data: sectionGroups, loading: loadingSectionGroup, error: errorSectionGroup, count: sectionGroupCount },
        createSectionGroup: { data: createSectionGroupData, loading: createSectionGroupLoading },
    } = useSelector((state) => state.sectionGroup);

    const {
        getPosts: { data: employeePositions, loading: loadingEmployeePositions, error: errorEmployeePositions, count: employeePositionsCount }
    } = useSelector((state) => state.post);

    const {
        createArticle: { data: createArticleData, loading: createArticleLoading }
    } = useSelector((state) => state.article)


    const {
        uploadArticleFile: { data: uploadArticleFileData, loading: uploadArticleFileLoading },
        uploadArticleImage: { data: uploadArticleImageData, loading: uploadArticleImageLoading },
    } = useSelector((state) => state.uploadArticleFile)

    const dispatch = useDispatch();

    useEffect(() => {
        if (createMarkData && newMark) {
            dispatch(getMarks());
            setNewMark('');
            setSuccessCreateMark(true);
            setTimeout(() => {
                setSuccessCreateMark(false);
            }, 3000);
            dispatch(resetCreateMark());
        }
    }, [createMarkData]);

    useEffect(() => {
        if (createSectionGroupData && newSectionGroup) {
            dispatch(getSectionGroups());
            setNewSectionGroup('');
            setSuccessCreateSectionGroup(true);
            setTimeout(() => {
                setSuccessCreateSectionGroup(false);
            }, 3000);
            dispatch(resetCreateSectionGroup());
        }
    }, [createSectionGroupData]);

    useEffect(() => {
        if (createSectionData && newSection) {
            dispatch(getSectionsByGroup(articleSectionGroup));
            setNewSection('');
            setSuccessCreateSection(true);
            setTimeout(() => {
                setSuccessCreateSection(false);
            }, 3000);
            dispatch(resetCreateSection());
        }
    }, [createSectionData]);


    useEffect(() => {
        dispatch(getMarks());
        dispatch(getSectionGroups());
        if (articleSectionGroup) dispatch(getSectionsByGroup(articleSectionGroup));
        dispatch(getPosts());
    }, [])

    useEffect(() => {
        if (articleSectionGroup) dispatch(getSectionsByGroup(articleSectionGroup));
    }, [articleSectionGroup])

    const onArticleNameChange = (e) => {
        setArticleName(e.target.value);
    }

    const onArticleDescChange = (e) => {
        setArticleDesc(e);
        setValue('content', e);
        console.log(e)
    }

    const onSectionGroupChange = (e) => {
        setArticleSectionGroup(e.target.value);
    }

    const onSectionChange = (e) => {
        let section = sections.find((item) => item.id === e.target.value)
        setArticleSection(section);
    }

    const onAddMarkBtnClick = () => {
        if (newMark) dispatch(createMark({ name: newMark }));
        else {
            setErrorCreateMark(true);
            const timer = setTimeout(() => {
                setErrorCreateMark(false);
                clearTimeout(timer);
            }, 3000);
        }
    }

    const onAddSectionBtnClick = () => {
        if (articleSectionGroup && newSection) dispatch(createSection({ name: newSection, groupId: articleSectionGroup }))
        else {
            setErrorCreateSection(true);
            const timer = setTimeout(() => {
                setErrorCreateSection(false);
                clearTimeout(timer);
            }, 3000)
        }
    }

    useEffect(() => {
        const options = employeePositions?.map((position) => <option value={position.id}>{position.name}</option>) ?? []
        setOptionsPosts(options);
    }, [employeePositions])

    useEffect(() => {
        const options = marks?.map((mark) => <option value={mark.id} label={mark.name}>{mark.name}</option>) ?? []
        setOptionsMarks(options);
    }, [marks])

    useEffect(() => {
        const options = sectionGroups?.map((group) => <option value={group.id}>{group.name}</option>) ?? []
        setOptionsSectionGroups(options);
    }, [sectionGroups])

    useEffect(() => {
        const options = sections?.map((section) => <option value={section.id}>{section.name}</option>) ?? []
        setOptionsSections(options);
    }, [sections])



    const onAddSectionGroupBtnClick = () => {
        if (newSectionGroup) dispatch(createSectionGroup({ name: newSectionGroup }));
        else {
            setErrorCreateSectionGroup(true);
            const timer = setTimeout(() => {
                setErrorCreateSectionGroup(false);
                clearTimeout(timer);
            }, 3000)
        }
    }

    const onDateChange = (e) => {
        setValue('date', e.target.value);
    }

    const onSaveBtnClick = () => {
        // получить все элементы
        const name = getValues('name');
        const date = getValues('date');
        const section = getValues('section');
        const mark = getValues('mark');
        const employeePosition = getValues('employeePosition');
        const content = getValues('content');

        let newDate = date.split('.').reverse().join('-');

        const article = {
            name: name,
            content: content,
            date: newDate,
            sectionId: section,
            employeePositionIds: employeePosition,
            markIds: mark,
        }

        dispatch(createArticle(article));
        dispatch(setActiveModal(''));
    }

    const onBtnDownloadClick = () => {

    }

    const onBtnAddedVideoFileClick = () => {
        const newVideo = {
            url: videoFileUrl,
            name: videoFileName,
            desc: videoFileDesc,
        }

        setVideoFilesList([...videoFilesList, newVideo]);

        setVideoFileUrl('');
        setVideoFileName('');
        setVideoFileDesc('');
    }

    const onBtnUploadTextFileClick = () => {
        let file = document.getElementById('textFiles').files[0];
        if (!file) return;
        dispatch(uploadArticleFile(file));
    }

    const onBtnUploadImageClick = () => {
        let file = document.getElementById('imageFiles').files[0];
        if (!file) return;
        dispatch(uploadArticleImage(file));
    }

    useEffect(() => {
        if (!uploadArticleFileData) return;

        const newFile = {
            name: textFileName,
            url: uploadArticleFileData,
        }

        setTextFilesList([...textFilesList, newFile])
        setTextFileName('');

    }, [uploadArticleFileData])

    useEffect(() => {
        if (!uploadArticleImageData) return;

        const url = `${process.env.REACT_APP_SERVER_API}/article/images/${uploadArticleImageData}`
        console.log(url);

        setImageUrl(url)

    }, [uploadArticleImageData])



    function imageHandler() {
        var range = this.quill.getSelection();
        var valuee = prompt('Введите URL изображения для ее добавления');
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
    const modulesVideo = useMemo(
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

    let element = (
        <>
            <Modal modalStyle={{ maxWidth: '50%' }} title="Добавление статьи" onSave={onSaveBtnClick} onClose={() => { }}>
                <div>
                    <input type="text" {...register('name', { required: true, maxLength: 40 })} onChange={onArticleNameChange} value={articleName} placeholder="Название статьи" />
                    <div className="date">
                        <div className="date__wrap">
                            <div className="date__title">от:</div>
                            <Controller
                                control={control}
                                name={'datePublish'}
                                rules={{ required: true, }}

                                render={({ field: { onChange, name, value } }) => <NumberFormat {...register('date')} format="##.##.####" mask="_" name={name} value={value} placeholder={'01.01.2022'} onChange={onDateChange} autoComplete="off" />}
                            />
                        </div>
                    </div>
                </div>


                <div className='modal__article__collapsed-group'>
                    <Collapse collapsible="header" defaultActiveKey={['1']} ghost>
                        <Panel header="Общая информация" key="1">
                            <div className='modal__article__select-group__container'>
                                <div className='modal__article__select-group'>
                                    <div className="modal__select">
                                        <select value={articleSectionGroup} onChange={onSectionGroupChange}>
                                            <option value={''}>Выберите группу</option>
                                            {optionsSectionGroups}
                                        </select>
                                    </div>
                                    <div className="modal__create">
                                        <input type="text" placeholder="Добавить группу" value={newSectionGroup} onChange={(e) => setNewSectionGroup(e.target.value)} autoComplete="off" />
                                        <button onClick={onAddSectionGroupBtnClick} disabled={successCreateSectionGroup}>
                                            <img alt='+' src="/img/modal/plus.svg" />
                                        </button>
                                    </div>
                                </div>
                                {errorCreateSectionGroup && <div className="text-error" style={{ marginBottom: '10px' }}> Введите название группы, для добавления </div>}
                                {successCreateSectionGroup && <div className="text-success" style={{ marginBottom: '10px' }}> Группа добавлена </div>}
                            </div>

                            <div className='modal__article__select-group__container'>
                                <div className='modal__article__select-group'>
                                    <div className="modal__select">
                                        <select {...register('section')} onChange={onSectionChange}>
                                            <option value={''}>Выберите раздел</option>
                                            {optionsSections}
                                        </select>
                                    </div>
                                    <div className="modal__create">
                                        <input type="text" placeholder="Добавить раздел" value={newSection} onChange={e => setNewSection(e.target.value)} autoComplete="off" />
                                        <button key={`btn-articles_section`} onClick={onAddSectionBtnClick} disabled={successCreateSection}>
                                            <img src="/img/modal/plus.svg" />
                                        </button>
                                    </div>
                                </div>
                                {errorCreateSection && <div className="text-error" style={{ marginBottom: '10px' }}> Введите название раздела, для добавления </div>}
                                {successCreateSection && <div className="text-success" style={{ marginBottom: '10px' }}> Раздел добавлен </div>}
                            </div>

                            <div className='modal__article__select-group__container'>
                                <div className='modal__article__select-group'>
                                    <div className="modal__select">
                                        <Select  {...register('mark')} onChange={(e) => setValue('mark', e)} mode='multiple' placeholder="Выберите метки" >
                                            <option value={''} selected>Выберите метки</option>
                                            {optionsMarks}
                                        </Select>
                                    </div>
                                    <div className="modal__create">
                                        <input type="text" placeholder="Добавить метку" value={newMark} onChange={(e) => setNewMark(e.target.value)} autoComplete="off" />
                                        <button key={`btn-articles_mark`} onClick={onAddMarkBtnClick} disabled={successCreateMark}>
                                            <img src="/img/modal/plus.svg" />
                                        </button>
                                    </div>
                                </div>
                                {errorCreateMark && <div className="text-error" style={{ marginBottom: '10px' }}> Введите название метки, для ее добавления </div>}
                                {successCreateMark && <div className="text-success" style={{ marginBottom: '10px' }}> Метка добавлена </div>}
                            </div>

                            <div className='modal__article__select-group__container'>
                                <div className='modal__article__select-group'>
                                    <div className="modal__select" style={{ width: '100%' }}>
                                        <Select  {...register('employeePosition')} mode='multiple' onChange={(e) => setValue('employeePosition', e)} placeholder="Выберите должности" >
                                            {optionsPosts}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </Panel>

                        <Panel header="Дополнительные текстовые файлы" key="2">
                            <div className='modal-article__group-container'>
                                <div className='modal-article__group-input-container'>
                                    <input id='textFiles' type="file" placeholder />
                                    <input placeholder='Наименование' value={textFileName} onChange={(e) => setTextFileName(e.target.value)} />
                                    <button disabled={!textFileName} className="modal-article__btn" onClick={onBtnUploadTextFileClick}>Загрузить</button>
                                </div>
                                <ul className='modal-article__group-container__list'>
                                    {textFilesList.map(el => <li key={el.url}>{el.name}</li>)}
                                </ul>
                            </div>
                        </Panel>

                        <Panel header="Дополнительные видео файлы" key="3">
                            <div className='modal-article__group-container'>
                                <div className='modal-article__group-input-container'>
                                    <input placeholder='URL видео' value={videoFileUrl} onChange={(e) => setVideoFileUrl(e.target.value)} />
                                    <input placeholder='Наименование' value={videoFileName} onChange={(e) => setVideoFileName(e.target.value)} />
                                    <button className="modal-article__btn" onClick={onBtnAddedVideoFileClick}>Загрузить</button>
                                </div>
                                <textarea placeholder="Краткое описание" rows="3" onChange={(e) => setVideoFileDesc(e)}>
                                    {videoFileDesc}
                                </textarea>
                                {(!_.isEmpty(videoFilesList))
                                    ? <ul className='modal-article__group-container__list'>
                                        {videoFilesList.map(el => <li key={el.url}>{el.name}</li>)}
                                    </ul>
                                    : null
                                }
                            </div>
                        </Panel>

                        <Panel header="Текст статьи" key="4">
                            <div className='modal-article__group-container'>
                                <div className='modal-article__group-input-container'>
                                    <input id='imageFiles' type="file" placeholder />
                                    <button className="modal-article__btn" onClick={onBtnUploadImageClick}>Загрузить</button>
                                    <div className="modal-article__url">{(imageUrl) ? imageUrl : 'URL изображения'}</div>
                                </div>
                                <div>
                                    <p>Загрузить из документа:</p>
                                    <input type="file" onChange={(e) => parseWordDocxFile(e.target)} />
                                </div>
                                <CustomToolbar />
                                <ReactQuill {...register('content')} value={articleDesc} onChange={(e) => onArticleDescChange(e)} modules={modules} formats={formats} />
                                {/* {renderedDoc ? (<div dangerouslySetInnerHTML={{ __html: renderedDoc }} />) : ( "")} */}
                            </div>
                        </Panel>

                    </Collapse>
                </div>
            </Modal >
        </>
    )

    return element;
}

export default ModalArticle;