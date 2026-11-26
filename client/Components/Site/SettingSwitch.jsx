import React from 'react';
import { Switch } from '@heroui/react';

const SettingSwitch = ({ label, hint, isSelected, isDisabled, onValueChange, className }) => (
    <Switch
        size='sm'
        isSelected={!!isSelected}
        isDisabled={isDisabled}
        onChange={onValueChange}
        className={className ?? 'block w-full border-t border-gold-hair last:border-b'}
    >
        <Switch.Content className='flex w-full cursor-pointer items-center justify-between gap-5 px-0.5 py-3'>
            <span className='flex min-w-0 flex-col'>
                <span className='text-base text-ink'>{label}</span>
                {hint && <span className='text-sm text-ink-faint'>{hint}</span>}
            </span>
            <Switch.Control className='shrink-0'>
                <Switch.Thumb />
            </Switch.Control>
        </Switch.Content>
    </Switch>
);

export default SettingSwitch;
