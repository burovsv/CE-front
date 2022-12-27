import React, { useEffect, useState, useMemo } from 'react';

import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import CustomToolbar from '../CustomToolbar';

import ReactQuill, { Quill } from 'react-quill';

const ModalArticle = () => {
    const [text, setText] = useState('');
    const [articleName, setArticleName] = useState('');
    const [articleDate, setArticleDate] = useState('');
    const [articleSection, setArticleSection] = useState('');
    const [articleSectionGroup, setArticleSectionGroup] = useState('');
    const [articleMarks, setArticleMarks] = useState([]);
    const [articleEmployeePosition, setArticleEmployeePosition] = useState([]);
    const [articleDesc, setArticleDesc] = useState('');

    // получить список групп, разделов, должностей, меток
    const {
        getMarks: { data: marks, loading: loadingMarks, error: errorMarks, count: marksCount }
    } = useSelector((state) => state.mark);
        
    const {
        getSections:  { data: sections, loading: loadingSection, error: errorSection, count: sectionCount }
    } = useSelector((state) => state.section);

    const {
        getSectionGroups:  { data: sectionGroups, loading: loadingSectionGroup, error: errorSectionGroup, count: sectionGroupCount }
    } = useSelector((state) => state.sectionGroup);

    const {
        getEmployees:  { data: employees, loading: loadingEmployeePositions, error: errorEmployeePositions, count: employeePositionsCount }   
    } = useSelector((state) => state.employee);

    useEffect(() => {
        console.log(employees);




    }, [employees]);

    const onArticleNameChange = (e) => {
        setArticleName(e.target.value);
    }

    const onArticleDescChange = (e) => {
        setArticleDesc(e);
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
            <Modal modalStyle={{maxWidth: '50%'}} title="Добавление статьи" onSave={() => {}} onClose={() => {}}>
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
                            <select>
                                <option value={''} selected>
                                    Группа
                                </option>
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
                            <select>
                                <option value={''} selected>
                                    Раздел
                                </option>
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
                            <select>
                                <option value={''} selected>
                                    Метка
                                </option>
                            </select>
                        </div>
                        <div className="modal__create">
                            <input type="text" placeholder="Добавить метку" autoComplete="off" />
                            <button> 
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