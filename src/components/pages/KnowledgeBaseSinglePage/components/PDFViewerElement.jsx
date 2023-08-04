import React, { useState } from "react"

const PDFViewerElement = ({ file }) => {

    return (
        <div style={{ height: "90vh" }}>
            <embed src={file.url} style={{ width: "100%", height: "100%" }} type="application/pdf"></embed>
        </div>
    )
}

export default PDFViewerElement;
