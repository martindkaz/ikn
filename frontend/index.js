import React, {useState} from 'react';
import {
    initializeBlock,
    useBase,
    useRecords,
    useGlobalConfig,
    useSettingsButton, 
    Text,
    Icon
} from '@airtable/blocks/ui';
import {viewport} from '@airtable/blocks';

import SchemaVisualizer from './SchemaVisualizer';
import FullscreenBox from './FullscreenBox';
import SettingsForm from './SettingsForm';
import './loadCss';

function SchemaMapBlock() {

    const [shouldShowSettings, setShouldShowSettings] = useState(false)

    const globalConfig = useGlobalConfig();
    const tableId = globalConfig.get('selectedTableId');
    const viewId = globalConfig.get('selectedViewId');
    const linkFieldId = globalConfig.get('selectedlinkFieldId');

    const uBase = useBase();
    const table = uBase.getTableByIdIfExists(tableId);
    const view = table ? table.getViewByIdIfExists(viewId) : null;
    const linkField = table ? table.getFieldByIdIfExists(linkFieldId) : null;

    const records = useRecords(view);
    let maxNumRecords;
    if (records) maxNumRecords = records.length;

    let knowTableViewField = false;
    if (table && view && linkField) {
        knowTableViewField = true; 
    } else {
        viewport.enterFullscreenIfPossible();
    }

    useSettingsButton(() => {
        // Enter fullscreen when settings is opened (but not when closed).
        if (!shouldShowSettings) {
            viewport.enterFullscreenIfPossible();
        }
        setShouldShowSettings(!shouldShowSettings);
    });

    return (
        <FullscreenBox id="index">
            { knowTableViewField ? (
                <SchemaVisualizer 
                    maxNumRecords={maxNumRecords}
                />
            ) : (
                <div>
                    <Text size="xlarge" marginTop="100px" marginLeft="100px">Please select a table, a view, and a linked record field:</Text>
                    <Icon name="right" size={20} marginLeft="100px"/>
                </div>
            )}
            { (!knowTableViewField || shouldShowSettings) && <SettingsForm setShouldShowSettings={setShouldShowSettings} />}
        </FullscreenBox>
    );
}

initializeBlock(() => <SchemaMapBlock />);
