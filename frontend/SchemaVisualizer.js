import React from 'react';
import {useState} from 'react';
import {Loader, Input, Box, Text} from '@airtable/blocks/ui';

import SvgPanZoomWrapper from './SvgPanZoomWrapper';
import HighlightWrapper from './HighlightWrapper';
import DragWrapper from './DragWrapper';
import FullscreenBox from './FullscreenBox';
import useLatestDrawableData from './settings';
import GraphNodesContainer from './GraphNodesContainer';
import GraphLinksContainer from './GraphLinksContainer';
import GraphTextContainer from './GraphTextContainer';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

export default function SchemaVisualizer({maxNumRecords}) {

    console.log('SchemaVisualizer')

    const [userContextString, setUserContextString] = useState('');
    const [numOfTopNodes, setNumOfTopNodes] = useState(maxNumRecords);

    const handleChange = (event, newValue) => {
        setNumOfTopNodes(newValue);
    }

    const {
        records,
        nodesData,
        nodeCoord,
        linkData,
        linksParAndChiByNode,
        nluNodeSizes,
        topFilteredNodes,
        haveDrawableData
    } = useLatestDrawableData(userContextString, numOfTopNodes);

    const useStyles = makeStyles({
        root: {
          width: 300,
        },
      });
    const classes = useStyles();

    return (

        <FullscreenBox>
            <Box display="flex" padding={3} borderBottom="thick">
                <Input 
                    value={userContextString}
                    onChange={e => setUserContextString(e.target.value)}
                    placeholder="Enter words for NLU context:"
                    width="320px"
                    size="large"
                    marginRight="50px"
                    marginTop="30px"
                />
                <div className={classes.root}>
                    <Typography id="discrete-slider" gutterBottom>
                        Top Nodes
                    </Typography>
                    <Slider 
                        value={numOfTopNodes} 
                        onChange={handleChange} 
                        // marks={true} 
                        aria-labelledby="continuous-slider" 
                        valueLabelDisplay="auto"
                        min={5}
                        max={records.length}
                    />
                </div>
            </Box>
            { haveDrawableData ? (
                <svg id="root" className="SchemaVisualizer" width="100%" height="90%">
                    <SvgPanZoomWrapper>
                        <HighlightWrapper
                            nodesData={nodesData}
                            linkData={linkData}
                            nodeCoord={nodeCoord}
                            records={records}
                            linksParAndChiByNode={linksParAndChiByNode}
                        >
                            <DragWrapper
                            >
                                <GraphNodesContainer
                                    nodesData={nodesData}
                                    nodeCoord={nodeCoord}
                                    nluNodeSizes={nluNodeSizes}
                                    topFilteredNodes={topFilteredNodes}
                                />
                                <GraphLinksContainer
                                    linkData={linkData}
                                    nodeCoord={nodeCoord}
                                    nluNodeSizes={nluNodeSizes}
                                    topFilteredNodes={topFilteredNodes}
                                />
                                <GraphTextContainer
                                    nodesData={nodesData}
                                    nodeCoord={nodeCoord}
                                    nluNodeSizes={nluNodeSizes}
                                    topFilteredNodes={topFilteredNodes}
                                />
                            </DragWrapper>
                        </HighlightWrapper>
                    </SvgPanZoomWrapper>  
                </svg>
            ) : (
                <div>
                    <Loader scale={0.5} marginTop="100px" marginLeft="100px"/>
                    <Text size="xlarge" marginTop="20px" marginLeft="100px">Running NLU (natural language understanding) algorithms on the text in your table/view. </Text>
                    <Text size="xlarge" marginTop="20px" marginLeft="100px">This block is built not to send any data out of you DB or browser for processing anywhere outside.  </Text>
                    <Text size="xlarge" marginTop="20px" marginLeft="100px">However this is also why it takes longer. A version using cloud APIs would be much faster. </Text>
                </div>
            )}
        </FullscreenBox>
    );
}

SchemaVisualizer.propTypes = {};
