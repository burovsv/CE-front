import React from "react";

const SectionElement = ({ sectionGroup, onSectionGroupClickHandler }) => {
    return (
        <div onClick={() => onSectionGroupClickHandler(sectionGroup)} className="knowledge-base__section-group-container">
            {sectionGroup?.name}
        </div>
    )
}

export default SectionElement;