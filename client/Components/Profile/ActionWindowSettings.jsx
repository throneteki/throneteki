import React from 'react';
import { Switch } from '@heroui/react';
import SettingsGroup from './SettingsGroup';
import { ActionWindows } from '../../constants';

const ActionWindowSettings = ({ description, values, isDisabled, onToggle }) => (
    <SettingsGroup
        title='Action windows'
        description={description}
        className='grid gap-2 p-3 sm:grid-cols-3'
    >
        {ActionWindows.map((window) => (
            <Switch
                key={window.name}
                size='sm'
                isSelected={!!values?.[window.name]}
                isDisabled={isDisabled}
                onValueChange={(isSelected) => onToggle(window.name, isSelected)}
                classNames={{
                    base: 'm-0 inline-flex w-full max-w-full cursor-pointer flex-row-reverse items-center justify-between gap-2 rounded-medium border border-default-200 px-3 py-2 hover:bg-default-100/50 data-[selected=true]:border-primary',
                    label: 'ms-0 text-small'
                }}
            >
                {window.label}
            </Switch>
        ))}
    </SettingsGroup>
);

export default ActionWindowSettings;
