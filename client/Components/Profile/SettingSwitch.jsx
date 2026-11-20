import React from 'react';
import { Switch } from '@heroui/react';

const SettingSwitch = ({ label, description, isSelected, isDisabled, onValueChange }) => (
    <Switch
        isSelected={isSelected}
        isDisabled={isDisabled}
        onValueChange={onValueChange}
        classNames={{
            base: 'm-0 inline-flex w-full max-w-full cursor-pointer flex-row-reverse items-center justify-between gap-4 px-3 py-2.5 hover:bg-default-100/50',
            label: 'ms-0 flex flex-col gap-0.5'
        }}
    >
        <span className='text-medium'>{label}</span>
        {description && <span className='text-small text-default-500'>{description}</span>}
    </Switch>
);

export default SettingSwitch;
