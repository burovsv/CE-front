import React, { useEffect, useState, useMemo } from 'react';

import { Select } from 'antd';

import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import CustomToolbar from '../CustomToolbar';


import { createMark } from '../../redux/actions/knowledgeBase/createMark.action';
import { getMarks } from '../../redux/actions/knowledgeBase/getMarks.action';

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


    // получить список групп, разделов, должностей, меток
    const {
        getMarks: { data: marks, loading: loadingMarks }
    } = useSelector((state) => state.mark);

    const {
        getSections: { data: sections, loading: loadingSection, error: errorSection, count: sectionCount }
    } = useSelector((state) => state.section);

    const {
        getSectionGroups: { data: sectionGroups, loading: loadingSectionGroup, error: errorSectionGroup, count: sectionGroupCount }
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
            name: '',
        },
    });

    const dispatch = useDispatch();



    useEffect(() => {
        dispatch(getMarks());

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

        console.log(markOptionsList);

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

    const onAddMark = (name) => {
        console.log(name);
        dispatch(createMark({ name }));
    }

    const handleChange = (html) => {
        //   setText(html);
        //   setValue('desc', html);
    };
    function imageHandler() {
        //   var range = this.quill.getSelection();
        //   var valuee = prompt('please copy paste the image url here.');
        //   if (valuee) {
        //     this.quill.insertEmbed(range.index, 'image', valuee, Quill.sources.USER);
        //   }
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
                    <div className='moadal__article__select-group'>
                        <div className="modal__select">
                            <select onChange={onSectionGroupChange}>
                                <option value={''} selected>
                                    Группа
                                </option>
                                {sectionGroupOptions}
                            </select>
                        </div>
                        <div className="modal__create">
                            <input type="text" placeholder="Добавить группу" autoComplete="off" />
                            <button>
                                <img src="/img/modal/plus.svg" />
                            </button>
                        </div>
                    </div>

                    <div className='moadal__article__select-group'>
                        <div className="modal__select">
                            <select onChange={onSectionChange}>
                                <option value={''} selected>
                                    Раздел
                                </option>
                                {sectionOptions}
                            </select>
                        </div>
                        <div className="modal__create">
                            <input type="text" placeholder="Добавить раздел" autoComplete="off" />
                            <button>
                                <img src="/img/modal/plus.svg" />
                            </button>
                        </div>
                    </div>

                    <div className='moadal__article__select-group'>
                        <div className="modal__select">
                            <Select
                                mode='multiple'
                                placeholder="Выберете метки"
                                options={markOptions}
                            >
                            </Select>

                        </div>
                        <div className="modal__create">
                            <input type="text" placeholder="Добавить метку" autoComplete="off" />
                            <button
                                onClick={filterForm.handleSubmit(onAddMark('name'))}
                            >
                                <img src="/img/modal/plus.svg" />
                            </button>
                        </div>
                    </div>


                    <div className='moadal__article__select-group'>
                        <div className="modal__select">
                            <select>
                                <option value={''} selected>
                                    Должность
                                </option>
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