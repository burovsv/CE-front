import React from "react";

const SectionGroupElement = ({ section, onSectionGroupClickHandler }) => {
    return (
        <div className="knowledge-page__section-container" onClick={(e) => onSectionGroupClickHandler(section)} >
            <div className="knowledge-page__section-name">
                {section?.name}
            </div>
            <div className="knowledge-page__section-result" >
                Результаты: {(section?.children) ? section.children.length : 0}
            </div>
        </div>
    )
}

export default SectionGroupElement;