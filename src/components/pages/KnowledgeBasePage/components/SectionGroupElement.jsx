import React from "react";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';


const SectionElement = ({ sectionGroup, onSectionGroupClickHandler }) => {
    return (
        <div onClick={() => onSectionGroupClickHandler(sectionGroup)} className="knowledge-base__section-group-container">
            {sectionGroup.isCollapsed ? <PlusOutlined /> : <MinusOutlined />}
            <div>
                {sectionGroup?.name}
            </div>
        </div>
    )
}

export default SectionElement;