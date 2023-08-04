import React from "react";

const FileListComponent = ({ el, key, onBtnClick }) => {
    return (
        <div style={{ display: 'flex' }}>
            <li key={key}>{el.name}</li>
            <button onClick={onBtnClick} style={{ marginLeft: '10px', border: 'solid 1px #e1e1e1', borderRadius: '2px', padding: '2px 5px' }}>Удалить</button>
        </div >)
}

export default FileListComponent;