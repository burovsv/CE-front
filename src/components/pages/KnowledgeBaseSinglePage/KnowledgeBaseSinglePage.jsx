import React from "react";
import * as _ from "lodash";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Collapse } from "antd";
import Axios from "axios";

import { getArticlesUser } from '../../../redux/actions/knowledgeBase/getArticlesUser.action';
import { getSectionGroups } from '../../../redux/actions/knowledgeBase/getSectionGroups.action';
import { resetGetArticlesUser } from "../../../redux/slices/article.slice";
import { resetGetSectionGroups } from "../../../redux/slices/sectionGroup.slice";

import { VideoPlayer, TextCollapseElement } from "./components";
import "./styles.css"

const { Panel } = Collapse;

const KnowledgeBaseSinglePage = () => {
    const [name, setName] = useState('');
    const [section, setSection] = useState('');
    const [sectionGroup, setSectionGroup] = useState('');
    const [articleMarks, setArticleMarks] = useState([]);
    const [mainContent, setMainContent] = useState('');
    const [textFilesList, setTextFilesList] = useState([]);
    const [videoFilesList, setVideoFilesList] = useState([]);

    const { knowledgeBaseId } = useParams();

    const {
        getArticlesUser: { data: articles, loading: loadingArticlesUser, error: errorArticlesUser }
    } = useSelector((state) => state.article);
    const {
        getSectionGroups: { data: sectionGroups, loading: loadingSectionGroup, error: errorSectionGroup, count: sectionGroupCount }
    } = useSelector((state) => state.sectionGroup);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getArticlesUser());
        dispatch(getSectionGroups());
        return () => {
            dispatch(resetGetArticlesUser());
            dispatch(resetGetSectionGroups());
        }
    }, []);

    useEffect(() => {
        if (!articles) return

        const article = articles.find(el => el.id == knowledgeBaseId);
        const sectionGroupId = article?.section?.sectionGroupId;
        const sectionGroup = sectionGroups?.find(group => group.id === sectionGroupId);
        const articleMarks = article?.marks ?? [];
        const articleFiles = article?.articleFiles ?? [];
        const mainContentUrl = _.find(articleFiles, { 'isMain': true })?.url ?? '';
        const url = `${process.env.REACT_APP_SERVER_API}${mainContentUrl}`;

        const additionalTextFiles = _.filter(articleFiles, function (el) {
            return el.isMain === false && el.type !== 'video'
        }) ?? [];

        const additionalVideoFiles = _.filter(articleFiles, { 'isMain': false, 'type': 'video' }) ?? [];
        setVideoFilesList(additionalVideoFiles)

        Axios(url).then(res => {
            setMainContent(res.data);
        });
        setTextFilesList([]);

        additionalTextFiles.forEach((data, key) => {
            let url = `${process.env.REACT_APP_SERVER_API}${data.url}`;

            Axios(url).then(res => {
                const file = {
                    name: data.name,
                    content: res.data,
                    type: data.type,
                    url: `${process.env.REACT_APP_SERVER_API}${data.url}`,
                    key: key
                }

                setTextFilesList(prev => {
                    if (prev.find(item => item.key === key)) {
                        return [...prev]
                    } else {
                        return [...prev, file]
                    }
                });
            });

        });

        setName(article?.name ?? "");
        setSection(article?.section?.name ?? "");
        setSectionGroup(sectionGroup?.name ?? "");
        setArticleMarks(articleMarks ?? []);
    }, [articles]);

    return (
        <div className="knowledge-base-single-page__root">
            <div className="knowledge-base-single-page__to-back">
                <ArrowLeftOutlined />
                <Link to={`/knowledgeBase`}>Назад</Link>
            </div>
            <h2>Статья: {name}</h2>
            <div className="knowledge-base-single-page__description-container">
                <div>Группа: {sectionGroup}</div>
                <div>Раздел: {section}</div>
                <div>
                    Метки: {articleMarks.map((mark, index) => <span id={index}>{mark.name}{index < articleMarks.length - 1 ? "," : "."} </span>)}
                </div>
            </div>
            <div className="knowledge-base-single-page__main-content">
                <Collapse>
                    <Panel header="Основная статья" key="1">
                        {mainContent ? <div dangerouslySetInnerHTML={{ __html: mainContent }} /> : ""}
                    </Panel>
                    {(!_.isEmpty(textFilesList))
                        ? < Panel header="Дополнительные текстовые материалы" key="2">
                            {textFilesList.map((file, index) => <TextCollapseElement file={file} index={index} />)}
                        </Panel>
                        : null}
                    {(!_.isEmpty(videoFilesList))
                        ? <Panel header="Дополнительные видео материалы" key="3">
                            {videoFilesList.map((file, index) => <VideoPlayer file={file} index={index} />)}
                        </Panel>
                        : null}
                </Collapse>
            </div>
        </div>
    )
}

export default KnowledgeBaseSinglePage;