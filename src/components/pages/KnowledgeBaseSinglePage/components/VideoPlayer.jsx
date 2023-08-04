import React from "react";
import ReactPlayer from 'react-player'
import { Collapse } from "antd";

const { Panel } = Collapse;

const VideoPlayer = ({ file, index }) => {

    return (
        <Collapse ghost>
            <Panel header={file.name} key={`2_${index}`}>
                <p>{file?.description}</p>
                <ReactPlayer url={file.url} />
            </Panel>
        </Collapse>
    )

}

export default VideoPlayer;