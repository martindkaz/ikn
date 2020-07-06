import React, {createContext, useContext, useCallback} from 'react';

import {SvgPanZoomContext} from './SvgPanZoomWrapper';

export const DragContext = createContext({handleDrag() {}});

/**
 */
export default function DragWrapper({
    children
}) {  
    const svgPanZoom = useContext(SvgPanZoomContext);

    const handleDrag = useCallback(
        (event, nodeId) => {

        },
        [
            svgPanZoom
        ],
    );

    return (
        <DragContext.Provider value={{handleDrag}}>
            {children}
            <g id="active-container" />
        </DragContext.Provider>
    );
}


