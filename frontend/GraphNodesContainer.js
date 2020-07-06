import React, {useContext} from 'react';
import {HighlightContext} from './HighlightWrapper';

/**
 */
export default function GraphNodesContainer({nodesData, nodeCoord, nluNodeSizes, topFilteredNodes}) {
    const {onNodeOrLinkMouseOver, onNodeOrLinkMouseOut, onNodeClick} = useContext(HighlightContext);

    return (
        <g
            id="nodes-container"
            onMouseMove={onNodeOrLinkMouseOver}
            onMouseOut={onNodeOrLinkMouseOut}
            onClick={onNodeClick}
        >
            {topFilteredNodes.map(nodeID => {
                return (
                    <circle
                        key={nodeID}
                        id={nodeID}
                        cx={nodeCoord[nodeID][0]*100}
                        cy={nodeCoord[nodeID][1]*100}
                        r={nluNodeSizes[nodeID]}
                        stroke='red' 
                        fill='red'
                        className='TableRow'
                    >
                       {/* <animate attributeName="r" values={'0;'+nluNodeSizes[nodeID]} dur="3s" /> */}
                    </circle>
                );
            })}
        </g>
    );
}


