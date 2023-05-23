import React, { useEffect, useState, useMemo } from 'react';

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


// import { getEmployeePositions } from '../../redux/actions/employeePosition/getEmployeePositions.action';
import { getPosts } from '../../../redux/actions/post/getPosts.action';

// создание статьи
import { createArticle } from '../../../redux/actions/knowledgeBase/createArticle.action';
import { resetCreateArticle } from '../../../redux/slices/article.slice';
import { resetGetOneArticle } from '../../../redux/slices/article.slice';
import { updateArticle } from '../../../redux/actions/knowledgeBase/updateArticle.action';

import ReactQuill, { Quill } from 'react-quill';
import * as mammoth from 'mammoth/mammoth.browser.js';
import moment from 'moment';
import Axios from 'axios';
import { resetGetPosts } from '../../../redux/slices/post.slice';

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
    const [videoFilesListElement, setVideoFilesListElement] = useState([]);
    // список файлов для записи
    const [documentFilesList, setDocumentFilesList] = useState([]);
    const [documentFilesListElement, setDocumentFilesListElement] = useState([]);
    const [loadedArticle, setLoadedArticle] = useState(null);
    const [loadedArticleMainText, setLoadedArticleMainText] = useState(null);

    const [errorList, setErrorList] = useState([]);


    // MAMMOTH
    function parseWordDocxFile(element, setValue) {
        if (!element) return;
        let file = element;

        console.time();
        var reader = new FileReader();
        reader.onloadend = function (event) {
            var arrayBuffer = reader.result;
            // debugger
            mammoth
                .convertToHtml({ arrayBuffer: arrayBuffer })
                .then(function (resultObject) {
                    let rendered = resultObject.value;
                    setValue(rendered)
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
        setValue,
        reset
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

    // подгрузка статьи для изменения
    useEffect(() => {
        if (oneArticleData) {
            // данные получим, потом их нужно очистить?
            let articleMarks = oneArticleData?.marks?.map(el => el.id) ?? [];
            let posts = oneArticleData?.posts?.map(el => el.id) ?? [];

            const articleFiles = oneArticleData?.articleFiles ?? [];

            let files = _.filter(articleFiles, e => e.type !== 'video' && e.isMain == false).map(el => {
                return { name: el.name, content: el.url, type: el.type, id: el.id }
            });
            let videoFiles = _.filter(articleFiles, e => e.type == 'video' && e.isMain == false).map(el => {
                return { name: el.name, url: el.url, desc: el.description, id: el.id }
            });
            let mainContentUrl = _.find(articleFiles, { 'isMain': true })?.url ?? '';
            let url = `${process.env.REACT_APP_SERVER_API}${mainContentUrl}`;

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
        if (articleSectionGroup) dispatch(getSectionsByGroup(articleSectionGroup));
    }, [articleSectionGroup])

    const onArticleDescChange = (e) => {
        setArticleDesc(e);
        setValue('content', e);
    }
    const onArticleDescInputChange = (e) => {
        let files = e.target.files || [];
        if (!files.length) return;

        let file = files[0];

        parseWordDocxFile(file, setArticleDesc)
    }

    const onSectionGroupChange = (e) => {
        setArticleSectionGroup(e.target.value);
    }

    const onSectionChange = (e) => {
        let section = sections.find((item) => item.id == e.target.value)
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
                let fileBody = {
                    file: el.content,
                    isMain: false,
                    articleId: createArticleData.id,
                    type: el.type,
                    name: el.name
                }
                dispatch(uploadArticleFile(fileBody));
            })


            videoFilesList.forEach(video => {
                let videoBody = {
                    name: video.name,
                    url: video.url,
                    description: video?.desc ?? '',
                    articleId: createArticleData.id,
                    type: 'video',
                    isMain: false,
                }
                dispatch(createArticleFile(videoBody))
            })
            // получаем все файлы и их отправляем их на сервер, в запрос передаем id статьи

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

    // определение расширения файла
    const ext = (name) => name.match(/\.([^.]+)$/)?.[1];

    const uploadTextFileInputChange = (e) => {
        let file = e.target.files[0];
        const format = ext(file.name);
        if (format !== 'docx') return;
        parseWordDocxFile(file, setAdditionDocDesc);
    }

    const onBtnUploadTextFileClick = async () => {
        let file = document.getElementById('textFiles').files[0] || [];
        if (!file) return;
        // определяем формат
        const format = ext(file.name);
        let el = {}
        if (format == 'docx') {
            let content = (additionDocDesc) ? additionDocDesc : file;
            let fileContent = new File([content], "text.txt", { type: "text/plain" })
            el = {
                name: textFileName,
                content: fileContent,
                type: 'docx',
            }
        } else if (format == 'pdf') {
            el = {
                name: textFileName,
                content: file,
                type: 'pdf',
            }
        } else {
            console.log('не поддерживаемый формат');
        }

        setTextFileName('');
        setAdditionDocDesc('');
        document.getElementById('textFiles').value = '';

        if (el) {
            setDocumentFilesList([...documentFilesList, el])
        };
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


    useEffect(() => {
        const onDocFileDelete = (el, key) => {
            let array = _.cloneDeep(documentFilesList);
            array.splice(key, 1)
            setDocumentFilesList(array);
        }

        let newEl = documentFilesList.map((el, key) => (
            <div style={{ display: 'flex' }}>
                <li key={key}>{el.name}</li>
                <button onClick={() => onDocFileDelete(el, key)} style={{ marginLeft: '10px', border: 'solid 1px #e1e1e1', borderRadius: '2px', padding: '2px 5px' }}>Удалить</button>
            </div>
        ))

        setDocumentFilesListElement(newEl)
    }, [documentFilesList])


    useEffect(() => {
        const onVideoFileDelete = (el, key) => {
            let array = _.cloneDeep(videoFilesList);
            array.splice(key, 1)
            setVideoFilesList(array);
        }

        let newEl = videoFilesList.map((el, key) => (
            <div style={{ display: 'flex' }}>
                <li key={key}>{el.name}</li>
                <button onClick={() => onVideoFileDelete(el, key)} style={{ marginLeft: '10px', border: 'solid 1px #e1e1e1', borderRadius: '2px', padding: '2px 5px' }}>Удалить</button>
            </div>
        ))

        setVideoFilesListElement(newEl)
    }, [videoFilesList])


    const onArticleClose = () => {
        // все переменные используемые обнуляем

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


    let element = (
        <>
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
                                    <input id='textFiles' type="file" accept='.docx, .pdf' placeholder onChange={uploadTextFileInputChange} />
                                    <input placeholder='Наименование' value={textFileName} onChange={(e) => setTextFileName(e.target.value)} />
                                    <button disabled={!textFileName} className="modal-article__btn" onClick={onBtnUploadTextFileClick}>Загрузить</button>
                                </div>
                                {({ documentFilesListElement })
                                    ? (<ul className='modal-article__group-container__list'>
                                        {documentFilesListElement}
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
                                {(!_.isEmpty(videoFilesListElement))
                                    ? <ul className='modal-article__group-container__list'>
                                        {videoFilesListElement}
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
        </>
    )

    return element;
}

export default ModalArticle;