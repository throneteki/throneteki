import React from 'react';
import { Label, Radio, RadioGroup } from '@heroui/react';
import classNames from 'classnames';

export const RadioOption = ({ value, className, contentClassName, children }) => (
    <Radio value={value} className={className}>
        <Radio.Content className={classNames('flex items-center gap-2', contentClassName)}>
            <Radio.Control>
                <Radio.Indicator />
            </Radio.Control>
            {children}
        </Radio.Content>
    </Radio>
);

const RadioField = ({
    label,
    name,
    value,
    onChange,
    options,
    orientation = 'vertical',
    isDisabled,
    className,
    optionsClassName,
    'aria-label': ariaLabel,
    children
}) => (
    <RadioGroup
        name={name || ariaLabel || label}
        value={value ?? null}
        onChange={onChange}
        orientation={orientation}
        isDisabled={isDisabled}
        aria-label={label ? undefined : ariaLabel}
        className={classNames('flex flex-col gap-2', className)}
    >
        {label && <Label className='text-sm text-ink-dim'>{label}</Label>}
        <div
            className={classNames(
                orientation === 'horizontal'
                    ? 'flex flex-wrap gap-x-5 gap-y-2'
                    : 'flex flex-col gap-2',
                optionsClassName
            )}
        >
            {options?.map((option) => (
                <RadioOption key={option.value} value={option.value}>
                    {option.label}
                </RadioOption>
            ))}
            {children}
        </div>
    </RadioGroup>
);

export default RadioField;
