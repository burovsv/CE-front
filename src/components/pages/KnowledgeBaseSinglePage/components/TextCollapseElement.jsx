import React from "react";
import { Collapse } from "antd";
import { PDFViewerElement } from "./index";

const { Panel } = Collapse;

const TextCollapseElement = ({ file, index }) => {
    return (
        <Collapse ghost>
            <Panel header={file.name} key={`2_${index}`}>
                {
                    (file.type === 'pdf')
                        ? <PDFViewerElement file={file} />
                        : <div dangerouslySetInnerHTML={{ __html: file.content }} />
                }
            </Panel>
        </Collapse>
    )
}

export default TextCollapseElement;