import React from "react";
import * as _ from "lodash";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router';
// import { addYouTubeIframe } from '../../utils/addYouTubeIframe';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

import { Collapse } from "antd";
import PDFViewer from 'pdf-viewer-reactjs'
import ReactPlayer from 'react-player'

import { getArticlesUser } from '../../redux/actions/knowledgeBase/getArticlesUser.action';
import { getMarks } from '../../redux/actions/knowledgeBase/getMarks.action';
import { getSections } from '../../redux/actions/knowledgeBase/getSections.action';
import { getSectionGroups } from '../../redux/actions/knowledgeBase/getSectionGroups.action';

import Axios from "axios";

const { Panel } = Collapse;

const KnowledgeBaseSinglePage = () => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [section, setSection] = useState('');
    const [sectionGroup, setSectionGroup] = useState('');
    const [articleMarks, setArticleMarks] = useState([]);
    const [mainContent, setMainContent] = useState('');
    const [textFilesList, setTextFilesList] = useState([]);
    const [videoFilesList, setVideoFilesList] = useState([]);

    const [textFilesElement, setTextFilesElement] = useState('');

    const { knowledgeBaseId } = useParams();

    const {
        getArticlesUser: { data: articles, loading: loadingArticlesUser, error: errorArticlesUser }
    } = useSelector((state) => state.article);
    
    const {
        getMarks: { data: marks, loading: loadingMarks, error: errorMarks, count: marksCount }
    } = useSelector((state) => state.mark);
        
    const {
        getSections:  { data: sections, loading: loadingSection, error: errorSection, count: sectionCount }
    } = useSelector((state) => state.section);

    const {
        getSectionGroups:  { data: sectionGroups, loading: loadingSectionGroup, error: errorSectionGroup, count: sectionGroupCount }
    } = useSelector((state) => state.sectionGroup);

    const dispatch = useDispatch();

    useEffect(() => {
        // инициализируем данные из бд
        dispatch(getArticlesUser());
        dispatch(getMarks());
        dispatch(getSections());
        dispatch(getSectionGroups());
    }, []);


    useEffect(() => {
        if (!articles) return

        let article = articles.find(el => el.id == knowledgeBaseId);
        let sectionGroupId = article?.section?.sectionGroupId;

        let sectionGroup = sectionGroups?.find(group => group.id == sectionGroupId );
        let articleMarks = article?.marks ?? [];

        let articleFiles = article?.articleFiles ?? [];

        let mainContentUrl = _.find(articleFiles, { 'isMain': true })?.url ?? '';
        let additionalTextFiles = _.filter(articleFiles, function (el) {
            return el.isMain == false && el.type != 'video'
        }) ?? [];
        let additionalVideoFiles = _.filter(articleFiles, { 'isMain': false, 'type': 'video' }) ?? [];

        setVideoFilesList(additionalVideoFiles)

        let url = `${process.env.REACT_APP_SERVER_API}${mainContentUrl}`;
        
        // let reader = new FileReader();
        // reader.readAsDataURL(mainContentUrl);
        // reader.onload = function () {
        //     console.log(reader);
        //     setMainContent(reader.result);
        // };

        // получить файл по url

        Axios(url).then(res => {
            // setText(res.data)
            setMainContent(res.data);
        });

        setTextFilesList([]);

        additionalTextFiles.forEach(data => {
            let url = `${process.env.REACT_APP_SERVER_API}${data.url}`;
            // if (data.type == 'pdf') return
            Axios(url).then(res => {
                // setText(res.data)
                let file = {
                    name: data.name,
                    content: res.data,
                    type: data.type,
                    url: `${process.env.REACT_APP_SERVER_API}${data.url}`
                }

                setTextFilesList(prev => [...prev, file]);
            });

        });

        setName(article.name);
        setDate(article.date);
        setDescription(article.content);
        setSection(article?.section?.name);
        setSectionGroup(sectionGroup.name);
        setArticleMarks(articleMarks);

        // должны обнулить значение article
    }, [articles]);

    const element = (
        <div
            style={{
                color: '#1e2d2d',
                height: '100%',
                backgroundColor: 'white',
                marginTop: '20px',
                padding: '20px',
            }}
        >
            <div style={{marginBottom: '20px'}}>
                <ArrowLeftOutlined />
                <Link to={`/knowledgeBase`} style={{marginLeft: '5px', color: 'black'}}>Назад</Link>
            </div>
            <h2>Статья: {name}</h2>
            <div style={{marginLeft: '20px', color: '#909090'}}>
                <div style={{marginTop: '10px'}}>Группа: {sectionGroup}</div>
                <div style={{marginTop: '10px'}}>Раздел: {section}</div>
                <div style={{marginTop: '10px'}}>Метки: {articleMarks.map((mark, index) => {                // песли последний элемент запяту не ставим
                    if (index === articleMarks.length - 1) {
                        return <span id={index}>{mark.name}</span>
                    } else {
                    return <span id={index}>{mark.name}, </span>
                    }})} 
                </div>
            </div>
            <div style={{
                marginTop: '20px',
                lineHeight: '1.6',
                // fontSize: '1.2rem',
                textAlign: 'justify',
        
            }}>
                <div className="knowledge-base-single-page__main-content"> 

                    <Collapse>
                        <Panel header="Основная статья" key="1">
                            {mainContent ? (<div dangerouslySetInnerHTML={{ __html: mainContent }} />) : ( "")}
                        </Panel>
                        <Panel header="Дополнительные текстовые материалы" key="2">
                            <Collapse ghost>
                                {textFilesList.map((file, index) => {
                                    return (
                                        <Panel header={file.name} key={`2_${index}`}>
                                            {
                                                (file.type == 'pdf') 
                                                    ? (<PDFViewer document={{
                                                            url: file.url,
                                                        }} />)
                                                    : (<div dangerouslySetInnerHTML={{ __html: file.content }} />)
                                            }
                                            
                                        </Panel>
                                    )
                                })}
                            </Collapse>
                        </Panel>
                        <Panel header="Дополнительные видео материалы" key="3">
                        <Collapse ghost>
                                {videoFilesList.map((file, index) => {
                                    return (
                                        <Panel header={file.name} key={`2_${index}`}>
                                            <p>{file?.description}</p>
                                            <ReactPlayer url={file.url} />
                                        </Panel>
                                    )
                                })}
                            </Collapse>
                        </Panel>
                    </Collapse>
                </div>
            </div>


        </div>
    )


    return element;
}

export default KnowledgeBaseSinglePage;