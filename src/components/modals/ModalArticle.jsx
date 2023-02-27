import React, { useEffect, useState, useMemo } from 'react';

import { Select } from 'antd';
import * as _ from 'lodash';

import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import CustomToolbar from '../CustomToolbar';

import { resetCreateMark } from '../../redux/slices/mark.slice';
import { createMark } from '../../redux/actions/knowledgeBase/createMark.action';
import { getMarks } from '../../redux/actions/knowledgeBase/getMarks.action';

import { resetCreateSectionGroup } from '../../redux/slices/sectionGroup.slice';
import { createSectionGroup } from '../../redux/actions/knowledgeBase/createSectionGroup.action';
import { getSectionGroups } from '../../redux/actions/knowledgeBase/getSectionGroups.action';

import { resetCreateSection } from '../../redux/slices/section.slice';
import { getSectionsByGroup } from '../../redux/actions/knowledgeBase/getSectionsByGroup.action';
import { createSection } from '../../redux/actions/knowledgeBase/createSection.action';

import { getEmployeePositions } from '../../redux/actions/employeePosition/getEmployeePositions.action';

// import { resetCreateSection } from '../../redux/slices/section.slice';
import { createArticle } from '../../redux/actions/knowledgeBase/createArticle.action';




import ReactQuill, { Quill } from 'react-quill';
// import { create } from 'domain';

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
        getEmployeePositions: { data: employeePositions, loading: loadingEmployeePositions, error: errorEmployeePositions, count: employeePositionsCount }
    } = useSelector((state) => state.employeePosition);

    const {
        createArticle: { data: createArticleData, loading: createArticleLoading }
    } = useSelector((state) => state.article)

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
        dispatch(getEmployeePositions());
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
    }

    const onSectionGroupChange = (e) => {
        setArticleSectionGroup(e.target.value);
    }

    const onSectionChange = (e) => {
        let section = sections.find((item) => item.id === e.target.value)
        setArticleSection(section);
    }

    const onEmployeePositionsChange = (e) => {
        setValue('employeePosition', e);
    }

    const onMarkChange = (e) => {
        setValue('mark', e);
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
        console.log('Нажали на кнопку сохранить');
        // получить все элементы
        console.log(getValues())

        console.log('Наименование ', getValues('name'));
        console.log('Дата ', getValues('date'));
        console.log('Раздел ', getValues('section'));
        console.log('Метки ', getValues('mark'));
        console.log('Должность ', getValues('employeePosition'));
        console.log('Контент ', getValues('content'));

    }

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
                                rules={{required: true,}}
                                
                                render={({ field: { onChange, name, value } }) => <NumberFormat {...register('date')} format="##.##.####" mask="_" name={name} value={value} placeholder={'01.01.2022'} onChange={onDateChange} autoComplete="off" />}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <div className='modal__article__select-group__container'>
                        <div className='modal__article__select-group'>
                            <div className="modal__select">
                                <select value={articleSectionGroup} onChange={onSectionGroupChange}>
                                    <option value={''}>Выберите группу</option>
                                    {sectionGroups?.map((group) => {
                                        return <option value={group.id}>{group.name}</option>
                                    })}
                                </select>
                            </div>
                            <div className="modal__create">
                                <input type="text" placeholder="Добавить группу" value={newSectionGroup} onChange={(e) => setNewSectionGroup(e.target.value)} autoComplete="off" />
                                <button onClick={onAddSectionGroupBtnClick} disabled={successCreateSectionGroup}>
                                    <img src="/img/modal/plus.svg" />
                                </button>
                            </div>
                        </div>
                        {errorCreateSectionGroup && <div class="text-error" style={{ marginBottom: '10px' }}> Введите название группы, для добавления </div>}
                        {successCreateSectionGroup && <div class="text-success" style={{ marginBottom: '10px' }}> Группа добавлена </div>}
                    </div>

                    <div className='modal__article__select-group__container'>
                        <div className='modal__article__select-group'>
                            <div className="modal__select">
                                <select {...register('section')} onChange={onSectionChange}>
                                    <option value={''}>Выберите раздел</option>
                                    {sections?.map((section) => {
                                        return <option value={section.id}>{section.name}</option>
                                    })}
                                </select>
                            </div>
                            <div className="modal__create">
                                <input type="text" placeholder="Добавить раздел" value={newSection} onChange={e => setNewSection(e.target.value)} autoComplete="off" />
                                <button key={`btn-articles_section`} onClick={onAddSectionBtnClick} disabled={successCreateSection}>
                                    <img src="/img/modal/plus.svg" />
                                </button>
                            </div>
                        </div>
                        {errorCreateSection && <div class="text-error" style={{ marginBottom: '10px' }}> Введите название раздела, для добавления </div>}
                        {successCreateSection && <div class="text-success" style={{ marginBottom: '10px' }}> Раздел добавлен </div>}
                    </div>

                    <div className='modal__article__select-group__container'>
                        <div className='modal__article__select-group'>
                            <div className="modal__select">
                                <Select {...register('mark')} onChange={(e) => onMarkChange(e)} mode='multiple' placeholder="Выберите метки" >
                                    <option value={''} selected>Выберите метки</option>
                                    {marks?.map((mark) => {
                                        return <option value={mark.id}>{mark.name}</option>
                                    })}
                                </Select>
                            </div>
                            <div className="modal__create">
                                <input type="text" placeholder="Добавить метку" value={newMark} onChange={(e) => setNewMark(e.target.value)} autoComplete="off" />
                                <button key={`btn-articles_mark`} onClick={onAddMarkBtnClick} disabled={successCreateMark}>
                                    <img src="/img/modal/plus.svg" />
                                </button>
                            </div>
                        </div>
                        {errorCreateMark && <div class="text-error" style={{ marginBottom: '10px' }}> Введите название метки, для ее добавления </div>}
                        {successCreateMark && <div class="text-success" style={{ marginBottom: '10px' }}> Метка добавлена </div>}
                    </div>

                    <div className='modal__article__select-group__container'>
                        <div className='modal__article__select-group'>
                            <div className="modal__select">
                                <Select  {...register('employeePosition')} mode='multiple' onChange={onEmployeePositionsChange} placeholder="Выберите должности" >
                                    {employeePositions?.map((position) => {
                                        return <option value={position.ID}>{position.name}</option>
                                    })}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
                <CustomToolbar />
                <ReactQuill {...register('content')}  value={articleDesc} onChange={onArticleDescChange} modules={modules} formats={formats} defaultValue={''} />
            </Modal >
        </>
    )

    return element;
}

export default ModalArticle;