import React, { useEffect, useState, useMemo, useCallback } from 'react';

import { Select, Collapse } from 'antd';
import * as _ from 'lodash';

import Modal from '../Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import CustomToolbar from '../../CustomToolbar';

import { setActiveModal } from '../../../redux/slices/app.slice';

import { resetCreateMark, resetGetMarks } from '../../../redux/slices/mark.slice';
import { createMark } from '../../../redux/actions/knowledgeBase/createMark.action';
import { getMarks } from '../../../redux/actions/knowledgeBase/getMarks.action';

import { resetCreateSectionGroup, resetGetSectionGroups } from '../../../redux/slices/sectionGroup.slice';
import { createSectionGroup } from '../../../redux/actions/knowledgeBase/createSectionGroup.action';
import { getSectionGroups } from '../../../redux/actions/knowledgeBase/getSectionGroups.action';

import { resetCreateSection, resetGetSectionsByGroup } from '../../../redux/slices/section.slice';
import { getSectionsByGroup } from '../../../redux/actions/knowledgeBase/getSectionsByGroup.action';
import { createSection } from '../../../redux/actions/knowledgeBase/createSection.action';

import { resetUploadArticleFile } from '../../../redux/slices/uploadArticleFile.slice';
import { uploadArticleFile } from '../../../redux/actions/knowledgeBase/uploadArticleFile.action';

import { createArticleFile } from '../../../redux/actions/knowledgeBase/createArticleFile.action';
import { deleteArticleFile } from '../../../redux/actions/knowledgeBase/deleteArticleFile.action';

import { getPosts } from '../../../redux/actions/post/getPosts.action';

import { createArticle } from '../../../redux/actions/knowledgeBase/createArticle.action';
import { resetCreateArticle } from '../../../redux/slices/article.slice';
import { resetGetOneArticle } from '../../../redux/slices/article.slice';
import { updateArticle } from '../../../redux/actions/knowledgeBase/updateArticle.action';

import ReactQuill, { Quill } from 'react-quill';
import moment from 'moment';
import Axios from 'axios';
import { resetGetPosts } from '../../../redux/slices/post.slice';
import { FileListComponent } from './components';

import { formats, parseWordDocxFile, uploadTextFileInputChange, getElementByFormat } from './utils/helper';

const { Panel } = Collapse;

const ModalArticle = () => {
    const [articleSection, setArticleSection] = useState('');
    const [articleSectionGroup, setArticleSectionGroup] = useState('');
    const [articleDesc, setArticleDesc] = useState('');
    const [additionDocDesc, setAdditionDocDesc] = useState('');

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

    const [articleEmployeePosition, setArticleEmployeePosition] = useState([]);
    const [articleMarks, setArticleMarks] = useState([]);
    const [textFilesList, setTextFilesList] = useState([]);
    const [textFileName, setTextFileName] = useState('');

    const [videoFileUrl, setVideoFileUrl] = useState('');
    const [videoFileName, setVideoFileName] = useState('');
    const [videoFileDesc, setVideoFileDesc] = useState('');
    const [videoFilesList, setVideoFilesList] = useState([]);

    const [documentFilesList, setDocumentFilesList] = useState([]);
    const [loadedArticle, setLoadedArticle] = useState(null);
    const [loadedArticleMainText, setLoadedArticleMainText] = useState(null);

    const [errorList, setErrorList] = useState([]);

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
        setValue,
        reset
    } = useForm({ defaultValues });

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
        createArticle: { data: createArticleData, loading: createArticleLoading },
        getOneArticle: { data: oneArticleData, loading: oneArticleDataLoading },
        updateArticle: { data: updateArticleData, loading: updateArticleDataLoading },
    } = useSelector((state) => state.article)

    const {
        uploadArticleFile: { data: uploadArticleFileData, loading: uploadArticleFileLoading },
    } = useSelector((state) => state.uploadArticleFile)

    const {
        createArticleFile: { data: articleFileData, loading: articleFileLoading },
        deleteArticleFile: { data: deleteArticleFileData, loading: deleteArticleFileLoading },
    } = useSelector((state) => state.articleFile)

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMarks());
        dispatch(getSectionGroups());
        if (articleSectionGroup) dispatch(getSectionsByGroup(articleSectionGroup));
        dispatch(getPosts());

        let todayDate = new Date();
        setValue('date', moment(todayDate).format("DD.MM.YYYY"));
        setErrorList([]);

        return () => {
            dispatch(resetGetMarks());
            dispatch(resetGetSectionGroups())
            dispatch(resetGetSectionsByGroup());
            dispatch(resetGetPosts());
        }
    }, [])

    useEffect(() => {
        if (oneArticleData) {
            const articleMarks = oneArticleData?.marks?.map(el => el.id) ?? [];
            const posts = oneArticleData?.posts?.map(el => el.id) ?? [];
            const articleFiles = oneArticleData?.articleFiles ?? [];

            const files = _.filter(articleFiles, e => e.type !== 'video' && e.isMain === false).map(el => {
                return { name: el.name, content: el.url, type: el.type, id: el.id }
            });
            const videoFiles = _.filter(articleFiles, e => e.type == 'video' && e.isMain === false).map(el => {
                return { name: el.name, url: el.url, desc: el.description, id: el.id }
            });
            const mainContentUrl = _.find(articleFiles, { 'isMain': true })?.url ?? '';
            const url = `${process.env.REACT_APP_SERVER_API}${mainContentUrl}`;

            setValue('name', oneArticleData.name)
            setValue('date', moment(oneArticleData.date).format("DD.MM.YYYY"));
            setArticleSectionGroup(oneArticleData.section.sectionGroupId);
            setArticleSection(oneArticleData.section.id)
            setValue('section', oneArticleData.section.id);
            setValue('employeePosition', posts);
            setDocumentFilesList(files);
            setVideoFilesList(videoFiles);
            setArticleEmployeePosition(posts)
            setArticleMarks(articleMarks)

            if (url) {
                Axios(url).then(res => {
                    // setText(res.data)
                    setArticleDesc(res.data);
                    setValue('content', res.data);
                    setLoadedArticleMainText(res.data)
                });
            }
            setLoadedArticle(oneArticleData);

            return () => {
                dispatch(resetGetOneArticle);
            }
        }
    }, [oneArticleData])

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
        if (uploadArticleFileData) {
            dispatch(resetUploadArticleFile())
        }
    }, [uploadArticleFileData])


    useEffect(() => {
        if (articleSectionGroup) {
            dispatch(getSectionsByGroup(articleSectionGroup));
        }
    }, [articleSectionGroup])

    const onArticleDescChange = (e) => {
        setArticleDesc(e);
        setValue('content', e);
    }
    const onArticleDescInputChange = (e) => {
        const files = e.target.files || [];
        if (!files.length) {
            return;
        }
        const file = files[0];

        parseWordDocxFile(file, setArticleDesc)
    }

    const onSectionGroupChange = (e) => {
        setArticleSectionGroup(e.target.value);
    }

    const onSectionChange = (e) => {
        setArticleSection(e.target.value);
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
        const options = employeePositions?.map((position) => {
            return {
                value: position.id,
                label: position.name
            }
        }) ?? []
        setOptionsPosts(options);
    }, [employeePositions])

    useEffect(() => {
        const options = marks?.map((mark) => {
            return {
                value: mark.id,
                label: mark.name
            }
        }) ?? []
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

    const onSaveBtnClick = () => {
        // получить все элементы
        const name = getValues('name');
        const date = getValues('date');
        // const section = getValues('section');
        const employeePosition = articleEmployeePosition;
        let newDate = date.split('.').reverse().join('-');

        const article = {
            name: name,
            date: newDate,
            sectionId: articleSection,
            employeePositionIds: employeePosition,
            markIds: articleMarks,
        }

        // обработка ошибок
        const createErrorEl = (name) => {
            return (
                <li>Не заполнено поле {name}</li>
            )
        }
        let errorArticleList = [];
        if (!name) errorArticleList.push(createErrorEl('наименование'));
        if (!newDate) errorArticleList.push(createErrorEl('дата'));
        if (!articleSection) errorArticleList.push(createErrorEl('раздел'));
        if (!articleSectionGroup) errorArticleList.push(createErrorEl('группа'));
        if (_.isEmpty(employeePosition)) errorArticleList.push(createErrorEl('должность'));
        if (_.isEmpty(getValues('content'))) errorArticleList.push(createErrorEl('основная статья'));

        setErrorList(errorArticleList);

        if (oneArticleData && _.isEmpty(errorArticleList)) {
            article.id = loadedArticle?.id

            let initArticleFiles = _.cloneDeep(oneArticleData?.articleFiles ?? []);

            let updateDocumentFileListWidthId = []

            documentFilesList?.forEach(el => {
                if (!oneArticleData?.id) return;
                if (!el?.id && oneArticleData?.id) {
                    let fileBody = {
                        file: el.content,
                        isMain: false,
                        articleId: oneArticleData.id,
                        type: el.type,
                        name: el.name
                    }
                    dispatch(uploadArticleFile(fileBody));
                } else {
                    updateDocumentFileListWidthId.push(el.id)
                }
            })

            videoFilesList?.forEach(video => {
                if (!oneArticleData?.id) return;
                if (!video?.id && oneArticleData?.id) {
                    let videoBody = {
                        name: video.name,
                        url: video.url,
                        description: video?.desc ?? '',
                        articleId: oneArticleData.id,
                        type: 'video',
                        isMain: false,
                    }
                    dispatch(createArticleFile(videoBody))
                } else {
                    updateDocumentFileListWidthId.push(video.id)
                }
            })

            let isMainTextId = null;

            initArticleFiles?.forEach(el => {
                if (!updateDocumentFileListWidthId.includes(el.id) && !el.isMain) {
                    dispatch(deleteArticleFile({ id: el.id }))
                } else if (el.isMain) {
                    isMainTextId = el.id
                }
            })
            const content = getValues('content');

            if (content !== loadedArticleMainText) {
                if (isMainTextId) dispatch(deleteArticleFile({ id: isMainTextId }))
                let fileText = new File([content], "text.txt", { type: "text/plain" })
                let doc = {
                    file: fileText,
                    isMain: true,
                    articleId: oneArticleData.id,
                    type: 'txt'
                }

                dispatch(uploadArticleFile(doc));
            }

            dispatch(updateArticle(article))
            dispatch(setActiveModal(''));


            return () => {
                dispatch(resetGetOneArticle())
                reset();
            }
        } else if (!oneArticleData && _.isEmpty(errorArticleList)) {
            dispatch(createArticle(article));
        }
    }

    useEffect(() => {
        if (createArticleData) {
            const content = getValues('content');
            let fileText = new File([content], "text.txt", { type: "text/plain" })

            let doc = {
                file: fileText,
                isMain: true,
                articleId: createArticleData.id,
                type: 'txt'
            }

            dispatch(uploadArticleFile(doc));

            documentFilesList.forEach(el => {
                const fileBody = {
                    file: el.content,
                    isMain: false,
                    articleId: createArticleData.id,
                    type: el.type,
                    name: el.name
                }
                dispatch(uploadArticleFile(fileBody));
            })


            videoFilesList.forEach(video => {
                const videoBody = {
                    name: video.name,
                    url: video.url,
                    description: video?.desc ?? '',
                    articleId: createArticleData.id,
                    type: 'video',
                    isMain: false,
                }
                dispatch(createArticleFile(videoBody))
            })

            dispatch(resetCreateArticle());
            reset();
            dispatch(setActiveModal(''));
        }
    }, [createArticleData])

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

    const onBtnUploadTextFileClick = async () => {
        const file = document.getElementById('textFiles').files[0] || [];
        if (!file) {
            return;
        }
        const el = getElementByFormat(file, additionDocDesc, textFileName)
        if (!el) {
            return
        };

        setTextFileName('');
        setAdditionDocDesc('');
        document.getElementById('textFiles').value = '';
        setDocumentFilesList([...documentFilesList, el])
    }

    useEffect(() => {
        if (!uploadArticleFileData) {
            return;
        }
        const newFile = {
            name: textFileName,
            url: uploadArticleFileData,
        }

        setTextFilesList([...textFilesList, newFile])
        setTextFileName('');
    }, [uploadArticleFileData])

    function imageHandler() {
        const range = this.quill.getSelection();
        const valuee = prompt('Введите URL изображения для ее добавления');
        if (valuee) {
            this.quill.insertEmbed(range.index, 'image', valuee, Quill.sources.USER);
        }
    }

    const modules = useMemo(
        () => ({
            toolbar: {
                container: '#toolbar',
                handlers: { image: imageHandler }
            }
        }), []
    );

    const onDocFileBtnDelClick = useCallback((key) => {
        let array = _.cloneDeep(documentFilesList);
        array.splice(key, 1)
        setDocumentFilesList(array);
    }, [documentFilesList])

    const onVideoFileBtnDelClick = useCallback((key) => {
        let array = _.cloneDeep(videoFilesList);
        array.splice(key, 1)
        setVideoFilesList(array);
    }, [videoFilesList])

    const onArticleClose = () => {
        setValue('name', '')
        setValue('date', '');
        setArticleSectionGroup([]);
        setArticleSection([])
        setValue('section', '');
        setValue('employeePosition', []);
        setDocumentFilesList([]);
        setVideoFilesList([]);
        setArticleEmployeePosition([])
        setArticleMarks([])

        dispatch(resetGetOneArticle());
    }

    return (
        <Modal modalStyle={{ maxWidth: '50%' }} title="Добавление статьи" onSave={onSaveBtnClick} onClose={onArticleClose}>
            <div>
                <input type="text" {...register('name', { required: true, maxLength: 40 })} placeholder="Название статьи" />
                <div className="date">
                    <div className="date__wrap">
                        <div className="date__title">от:</div>
                        <Controller
                            control={control}
                            name={'date'}
                            rules={{ required: true, }}
                            render={({ field: { onChange, name, value } }) => <NumberFormat format="##.##.####" mask="_" name={name} value={value} onChange={onChange} autoComplete="off" />}
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
                                    <select value={articleSection} onChange={onSectionChange}>
                                        <option value={''} >Выберите раздел</option>
                                        {optionsSections}
                                    </select>
                                </div>
                                <div className="modal__create">
                                    <input type="text" placeholder="Добавить раздел" value={newSection} onChange={e => setNewSection(e.target.value)} autoComplete="off" />
                                    <button key={`btn-articles_section`} onClick={onAddSectionBtnClick} disabled={successCreateSection}>
                                        <img alt='+' src="/img/modal/plus.svg" />
                                    </button>
                                </div>
                            </div>
                            {errorCreateSection && <div className="text-error" style={{ marginBottom: '10px' }}> Введите название раздела, для добавления </div>}
                            {successCreateSection && <div className="text-success" style={{ marginBottom: '10px' }}> Раздел добавлен </div>}
                        </div>
                        <div className='modal__article__select-group__container'>
                            <div className='modal__article__select-group'>
                                <div className="modal__select">
                                    <Select options={optionsMarks} value={articleMarks} mode='multiple' onChange={(e) => setArticleMarks(e)} placeholder="Выберите метки" >
                                    </Select>
                                </div>
                                <div className="modal__create">
                                    <input type="text" placeholder="Добавить метку" value={newMark} onChange={(e) => setNewMark(e.target.value)} autoComplete="off" />
                                    <button key={`btn-articles_mark`} onClick={onAddMarkBtnClick} disabled={successCreateMark}>
                                        <img alt='+' src="/img/modal/plus.svg" />
                                    </button>
                                </div>
                            </div>
                            {errorCreateMark && <div className="text-error" style={{ marginBottom: '10px' }}> Введите название метки, для ее добавления </div>}
                            {successCreateMark && <div className="text-success" style={{ marginBottom: '10px' }}> Метка добавлена </div>}
                        </div>
                        <div className='modal__article__select-group__container'>
                            <div className='modal__article__select-group'>
                                <div className="modal__select" style={{ width: '100%' }}>
                                    <Select options={optionsPosts} value={articleEmployeePosition} mode='multiple' onChange={(e) => setArticleEmployeePosition(e)} placeholder="Выберите должности" >
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </Panel>
                    <Panel header="Дополнительные текстовые файлы" key="2">
                        <div className='modal-article__group-container'>
                            <div className='modal-article__group-input-container'>
                                <input id='textFiles' type="file" accept='.docx, .pdf' placeholder onChange={(e) => uploadTextFileInputChange(e, setAdditionDocDesc)} />
                                <input placeholder='Наименование' value={textFileName} onChange={(e) => setTextFileName(e.target.value)} />
                                <button disabled={!textFileName} className="modal-article__btn" onClick={onBtnUploadTextFileClick}>Загрузить</button>
                            </div>
                            {({ documentFilesList })
                                ? (<ul className='modal-article__group-container__list'>
                                    {documentFilesList.map((el, key) => <FileListComponent el={el} key={key} onBtnClick={() => onDocFileBtnDelClick(key)} />)}
                                </ul>)
                                : null}
                        </div>
                    </Panel>
                    <Panel header="Дополнительные видео файлы" key="3">
                        <div className='modal-article__group-container'>
                            <div className='modal-article__group-input-container'>
                                <input placeholder='URL видео' value={videoFileUrl} onChange={(e) => setVideoFileUrl(e.target.value)} />
                                <input placeholder='Наименование' value={videoFileName} onChange={(e) => setVideoFileName(e.target.value)} />
                                <button className="modal-article__btn" onClick={onBtnAddedVideoFileClick}>Загрузить</button>
                            </div>
                            <textarea placeholder="Краткое описание" rows="3" value={videoFileDesc} onChange={(e) => setVideoFileDesc(e.target.value)}>
                                {/* {videoFileDesc} */}
                            </textarea>
                            {(!_.isEmpty(videoFilesList))
                                ? <ul className='modal-article__group-container__list'>
                                    {videoFilesList.map((el, key) => <FileListComponent el={el} key={key} onBtnClick={() => onVideoFileBtnDelClick(key)} />)}
                                </ul>
                                : null
                            }
                        </div>
                    </Panel>
                    <Panel header="Текст статьи" key="4">
                        <div className='modal-article__group-container'>
                            <div>
                                <p>Загрузить из документа:</p>
                                <input type="file" accept='.docx' onChange={onArticleDescInputChange} />
                            </div>
                            <CustomToolbar />
                            <ReactQuill {...register('content')} value={articleDesc} onChange={(e) => onArticleDescChange(e)} modules={modules} formats={formats} />
                        </div>
                    </Panel>
                </Collapse>
                {(!_.isEmpty(errorList))
                    ? (<ul style={{ color: 'red' }} className='modal-article__group-container__list'>
                        {errorList}
                    </ul>)
                    : null}
            </div>
        </Modal >
    )
}

export default ModalArticle;