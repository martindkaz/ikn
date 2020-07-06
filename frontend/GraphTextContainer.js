import React, {useContext} from 'react';
import {HighlightContext} from './HighlightWrapper';

/**
 */
export default function GraphTextContainer({nodesData, nodeCoord, nluNodeSizes, topFilteredNodes}) {
    const {onNodeOrLinkMouseOver, onNodeOrLinkMouseOut} = useContext(HighlightContext);

    return (
        <g
            id="text-container"
            onMouseMove={onNodeOrLinkMouseOver}
            onMouseOut={onNodeOrLinkMouseOut}
        >
            {topFilteredNodes.map(nodeID => {
                return (
                    <text 
                        key={nodeID+'-text'}
                        id={nodeID+'-text'}
                        x={nodeCoord[nodeID][0]*100 + nluNodeSizes[nodeID] + 2}
                        y={nodeCoord[nodeID][1]*100 + nluNodeSizes[nodeID]/2}
                        className='Text'
                        // textLength={nluNodeSizes[nodeID]*5}
                        // lengthAdjust='spacingAndGlyphs'
                    >
                        {nodesData[nodeID]['name']}
                    </text>
                );
            })}
        </g>
    );
}

