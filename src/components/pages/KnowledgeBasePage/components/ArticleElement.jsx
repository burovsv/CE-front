import React from "react";
import { Link } from 'react-router-dom';

const ArticleElement = ({ article }) => {
    const articlesMarks = article?.data?.marks ?? [];

    return (
        <div className="knowledge-page__article_container">
            <div className="knowledge-page__article_name" >
                <Link className="knowledge-page__article_link" to={`/knowledgeBase/${article?.id}`} >
                    {article?.name ?? ''}
                </Link>
                <div className="knowledge-page__article_date">
                    26.12.2022
                </div>
            </div>
            <div className="knowledge-page__article_mark-container">
                <div> Метки: </div>
                <div className="knowledge-page__article_mark">
                    {articlesMarks.map((mark, index) => {
                        return (
                            <span>
                                {mark?.name}{(index === articlesMarks.length - 1) ? '' : ', '}
                            </span>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ArticleElement;