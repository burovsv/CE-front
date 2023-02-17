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

import { resetCreateSectionGroup } from '../../redux/actions/knowledgeBase/createSectionGroup.action';
import { createSectionGroup } from '../../redux/actions/knowledgeBase/createSectionGroup.action';
import { getSectionGroup } from '../../redux/actions/knowledgeBase/createSectionGroup.action';

import ReactQuill, { Quill } from 'react-quill';
// import { create } from 'domain';

const ModalArticle = () => {
    const [text, setText] = useState('');
    const [articleName, setArticleName] = useState('');
    const [articleDate, setArticleDate] = useState('');
    const [articleSection, setArticleSection] = useState('');
    const [articleSectionGroup, setArticleSectionGroup] = useState('');
    const [articleMarks, setArticleMarks] = useState([]);
    const [articleEmployeePosition, setArticleEmployeePosition] = useState([]);
    const [articleDesc, setArticleDesc] = useState('');
    const [sectionGroupOptions, setSectionGroupOptions] = useState([]);
    const [sectionOptions, setSectionOptions] = useState([]);
    const [markOptions, setMarkOptions] = useState([]);

    const [successCreateMark, setSeccessCreateMark] = useState(false)
    const [successCreateSection, setSeccessCreateSection] = useState(false)
    const [successCreateSectionGroup, setSeccessCreateSectionGroup] = useState(false)

// Для добавления новых эл-ов в бд
    const [newMark, setNewMark] = useState('');
    const [newSection, setNewSection] = useState('');
    const [newGroupSection, setNewGroupSection] = useState('');

    // вывод ошибок
    const [errorCreateMark, setErrorCreateMark] = useState(false)



    // получить список групп, разделов, должностей, меток
    const {
        getMarks: { data: marks, loading: loadingMarks },
        createMark: { data: createMarkData, loading: createMarkLoading },
    } = useSelector((state) => state.mark);

    const {
        getSections: { data: sections, loading: loadingSection, error: errorSection, count: sectionCount }
    } = useSelector((state) => state.section);

    const {
        getSectionGroups: { data: sectionGroups, loading: loadingSectionGroup, error: errorSectionGroup, count: sectionGroupCount },
        createSectionGroup: { data: createSectionGroupData, loading: createSectionGroupLoading },
    } = useSelector((state) => state.sectionGroup);

    const {
        getEmployees: { data: employees, loading: loadingEmployeePositions, error: errorEmployeePositions, count: employeePositionsCount }
    } = useSelector((state) => state.employee);

    const updateSectionOptions = (group = articleSectionGroup) => {
        let sectionOptionsList = [];
        sections.forEach((item) => {
            if (group?.id === item.sectionGroup) {
                sectionOptionsList.push(
                    <option value={item.id} key={item.id}>
                        {item.name}
                    </option>
                )
            }
        })

        setSectionOptions(sectionOptionsList);
    }
    const filterForm = useForm({
        deafultValues: {
            mark: '',
            sectionGroup: '',
        },
    });

    const dispatch = useDispatch();

    useEffect(() => {
        if (createMarkData && newMark) {
          dispatch(getMarks());
          setNewMark('');
          setSeccessCreateMark(true);
          setTimeout(() => {
            setSeccessCreateMark(false);
          }, 3000);
          dispatch(resetCreateMark());
        }
    }, [createMarkData]);
    

    useEffect(()=> {
        dispatch(getMarks());
    }, [])


    useEffect(() => {
        let sectionGroupOptionsList = sectionGroups.map((item) => {
            return (
                <option value={item.id} key={item.id}>
                    {item.name}
                </option>
            )
        })

        let markOptionsList = marks.map((item) => {
            return {
                label: item.name,
                value: item.id
            }
        })

        setSectionGroupOptions(sectionGroupOptionsList);
        setMarkOptions(markOptionsList);
        updateSectionOptions();
    }, [employees, sectionGroups, sections]);

    const onArticleNameChange = (e) => {
        setArticleName(e.target.value);
    }

    const onArticleDescChange = (e) => {
        setArticleDesc(e);
    }

    const onSectionGroupChange = (e) => {
        let sectionGroup = sectionGroups.find((item) => {
            return item.id === e.target.value;
        })
        setArticleSectionGroup(sectionGroup);
        updateSectionOptions(sectionGroup);
    }

    const onSectionChange = (e) => {
        let section = sections.find((item) => item.id === e.target.value)
        setArticleSection(section);
    }

    const onAddMarkBtnClick = () => {
        if (newMark) dispatch(createMark( {name: newMark} ));
        else {
            setErrorCreateMark(true);
            const timer = setTimeout(() => {
                setErrorCreateMark(false);
                clearTimeout(timer);
            }, 3000);
        }
    }

    const onAddSectionBtnClick = () => {
        console.log('Section click');
        console.log(filterForm.getValues('section'));
    }
    
    const onAddSectionGroupBtnClick = () => {
        const sectionGroup = filterForm.getValues('sectionGroup') ?? '';
        dispatch(createSectionGroup( {name: sectionGroup} ));
    }

    function imageHandler() { }

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
            <Modal modalStyle={{ maxWidth: '50%' }} title="Добавление статьи" onSave={() => { }} onClose={() => { }}>
                <div>
                    <input type="text" onChange={onArticleNameChange} value={articleName} placeholder="Название статьи" />
                    <div className="date">
                        <div className="date__wrap">
                            <div className="date__title">от:</div>
                            {/* <Controller
                            render={({ field: { onChange, name, value } }) => <NumberFormat format="##.##.####" mask="_" name={name} value={value} placeholder={'01.01.2022'} onChange={onChange} autoComplete="off" />}
                        /> */}
                        </div>
                    </div>
                </div>

                <div>
                    <div className='modal__article__select-group__container'>
                        <div className='modal__article__select-group'>
                            <div className="modal__select">
                                <select onChange={onSectionGroupChange}>
                                    <option value={''} selected>
                                        Группа
                                    </option>
                                    {sectionGroupOptions}
                                </select>
                            </div>
                            <div className="modal__create">
                                <input type="text" placeholder="Добавить группу" {...filterForm.register('sectionGroup', { required: true })} autoComplete="off" />
                                <button onClick={onAddSectionGroupBtnClick} disabled={successCreateSectionGroup}>
                                    <img src="/img/modal/plus.svg" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='modal__article__select-group__container'>
                        <div className='modal__article__select-group'>
                            <div className="modal__select">
                                <select onChange={onSectionChange}>
                                    <option value={''} selected>
                                        Раздел
                                    </option>
                                    {sectionOptions}
                                </select>
                            </div>
                            <div className="modal__create">
                                <input type="text" placeholder="Добавить раздел" {...filterForm.register('section', { required: true })} autoComplete="off" />
                                <button key={`btn-articles_section`} onClick={onAddSectionBtnClick} disabled={successCreateSection}>
                                    <img src="/img/modal/plus.svg" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='modal__article__select-group__container'>
                        <div className='modal__article__select-group'>
                            <div className="modal__select">
                                <Select mode='multiple' placeholder="Выберете метки" >
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

                    <div className='modal__article__select-group'>
                        <div className="modal__select">
                            <select>
                                <option value={''} selected>Должность</option>
                            </select>
                        </div>
                    </div>
                </div>
                <CustomToolbar />
                <ReactQuill value={articleDesc} onChange={onArticleDescChange} modules={modules} formats={formats} defaultValue={''} />
            </Modal >
        </>
    )

    return element;
}

export default ModalArticle;