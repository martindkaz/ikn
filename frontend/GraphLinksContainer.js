import React, {useContext} from 'react';
import {HighlightContext} from './HighlightWrapper';


/**
 */
export default function LinkContainer({linkData, nodeCoord, nluNodeSizes, topFilteredNodes}) {

    const {onNodeOrLinkMouseOver, onNodeOrLinkMouseOut} = useContext(HighlightContext);

    return (
        <g
            id="links-container"
            onMouseMove={onNodeOrLinkMouseOver}
            onMouseOut={onNodeOrLinkMouseOut}
        >
            <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="4" 
                refX="6" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" />
                </marker>
            </defs>
            {Object.values(linkData).map(link => {

                if (!topFilteredNodes.includes(link['source']) || !topFilteredNodes.includes(link['destin'])) {
                    return;
                }

                let x1 = nodeCoord[link['source']][0] * 100;
                let x2 = nodeCoord[link['destin']][0] * 100;
                if (x2>x1) {
                    x1 = x1 + nluNodeSizes[link['source']] / 1.41;
                    x2 = x2 - nluNodeSizes[link['destin']] / 1.41;
                } else {
                    x1 = x1 - nluNodeSizes[link['source']] / 1.41;
                    x2 = x2 + nluNodeSizes[link['destin']] / 1.41;
                }
                let y1 = nodeCoord[link['source']][1] * 100;
                let y2 = nodeCoord[link['destin']][1] * 100;
                if (y2>y1) {
                    y1 = y1 + nluNodeSizes[link['source']] / 1.41;
                    y2 = y2 - nluNodeSizes[link['destin']] / 1.41;
                } else {
                    y1 = y1 - nluNodeSizes[link['source']] / 1.41;
                    y2 = y2 + nluNodeSizes[link['destin']] / 1.41;
                }
                return (
                    <line
                        key={link['id']}
                        id={link['id']}
                        x1={x1}
                        x2={x2}
                        y1={y1}
                        y2={y2}
                        stroke='black'
                        strokeWidth={link['thick']}
                        markerEnd='url(#arrowhead)'
                        className='Link'
                    />
                );
            })}
        </g>
    );
}


