import {loadCSSFromString, colorUtils, colors} from '@airtable/blocks/ui';

import {FONT_FAMILY, FONT_SIZE} from './constants';

const css = `
    .SchemaVisualizer {
        background-color: #F3F2F1;
    }

    .TableRow {
        font-family: ${FONT_FAMILY};
        font-size: ${FONT_SIZE};
        cursor: zoom-in;
    }

    .TableRow:not(.TableHeader) {
        fill: #f00;
        stroke-width: 0;
    }

    .TableRow:not(.TableHeader):hover {
        fill: #0aa;
    }

    .TableRow.highlighted {
        fill: #0ff;
    }
    
    .TableRow.draggable {
        cursor: grab;
    }

    .Text {
        color: 'black';
    }

    .Text:hover {
        color: #0ff;
    }

    .Link {
        fill: none;
        stroke: 'black';
        stroke-width: 0.5px;
        stroke-opacity: 0.6;
    }

    .Link:hover {
        fill: none;
        stroke: #0aa;
        stroke-width: 1px;
        stroke-opacity: 0.6;
    }

    .Link.highlighted {
        stroke-width: 2px;
        stroke-opacity: 1;
        stroke-dasharray: 6px;
        stroke-dashoffset: 12px;
        animation: stroke 0.5s linear infinite;
        shape-rendering: geometricPrecision;
    }

    @keyframes stroke {
        to {
            stroke-dashoffset: 0;
        }
    }
`;

loadCSSFromString(css);
