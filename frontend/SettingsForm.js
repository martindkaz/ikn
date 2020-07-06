import React from 'react';
import {
    useBase,
    useGlobalConfig,
    TablePickerSynced,
    ViewPickerSynced,
    FieldPickerSynced,
    FormField,
    Button,
    Box,
    Heading, 
} from '@airtable/blocks/ui';
import {FieldType} from '@airtable/blocks/models';
import PropTypes from 'prop-types';

import FullscreenBox from './FullscreenBox';


// MD: To delete/reuse the schema old setting below
//

/**
 * Settings form component.
 *
 * @param {Function} props.setShouldShowSettings Function to toggle settings visibility
 */
export default function SettingsForm({setShouldShowSettings}) {

    console.log('SETTINGS FORM:')
    
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const tableId = globalConfig.get('selectedTableId');

    const table = base.getTableByIdIfExists(tableId);

    return (
        <FullscreenBox
            left="initial" // show settings in right sidebar
            width="360px"
            backgroundColor="white"
            display="flex"
            flexDirection="column"
            borderLeft="thick"
        >
            <Box flex="auto" display="flex" justifyContent="center" overflow="auto">
                <Box paddingTop={4} paddingBottom={2} maxWidth={300} flex="auto">
                    <Heading marginBottom={2}>Settings</Heading>
                    
                    <FormField label="Table">
                        <TablePickerSynced globalConfigKey="selectedTableId" />
                    </FormField>
                    <FormField label="View">
                        <ViewPickerSynced table={table} globalConfigKey="selectedViewId" />
                    </FormField>
                    <FormField label="Field" marginBottom={0}>
                        <FieldPickerSynced
                            table={table}
                            globalConfigKey="selectedlinkFieldId"
                            placeholder="Pick a linked records field..."
                            allowedTypes={[FieldType.MULTIPLE_RECORD_LINKS]}
                        />
                    </FormField>
                </Box>
            </Box>
            <Box
                flex="none"
                borderTop="thick"
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
            >
                <Button
                    margin={3}
                    variant="primary"
                    size="large"
                    onClick={() => setShouldShowSettings(false)}
                >
                    Done
                </Button>
            </Box>
        </FullscreenBox>
    );
}

SettingsForm.propTypes = {
    setShouldShowSettings: PropTypes.func.isRequired,
};
