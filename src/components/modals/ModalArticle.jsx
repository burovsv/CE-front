import React, { useEffect, useState, useMemo } from 'react';

import Modal from './Modal';
import { useForm, Controller } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import CustomToolbar from '../CustomToolbar';

import ReactQuill, { Quill } from 'react-quill';






const ModalArticle = () => {
    const [text, setText] = useState('');
    
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
                    <input type="text" placeholder="Название статьи" />
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
                    <ReactQuill value={text} onChange={handleChange} modules={modules} formats={formats} defaultValue={''} />
            </Modal >
        </>
    )

    return element;
}

export default ModalArticle;