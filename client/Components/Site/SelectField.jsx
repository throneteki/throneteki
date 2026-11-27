import React from 'react';
import { Description, FieldError, Label, ListBox, Select } from '@heroui/react';
import classNames from 'classnames';

const SelectField = ({
    label,
    description,
    errorMessage,
    isInvalid,
    items,
    value,
    onChange,
    placeholder,
    selectionMode = 'single',
    isDisabled,
    className,
    style,
    renderValue,
    'aria-label': ariaLabel
}) => (
    <Select
        className={classNames('flex flex-col gap-1', className)}
        style={style}
        value={value ?? null}
        onChange={onChange}
        placeholder={placeholder}
        selectionMode={selectionMode}
        isDisabled={isDisabled}
        isInvalid={isInvalid ?? !!errorMessage}
        aria-label={label ? undefined : ariaLabel}
    >
        {label && <Label className='text-sm text-ink-dim'>{label}</Label>}
        <Select.Trigger className='min-w-0'>
            <Select.Value className='min-w-0 truncate'>
                {({ defaultChildren, isPlaceholder, state }) => {
                    if (isPlaceholder || state.selectedItems.length === 0) {
                        return defaultChildren;
                    }

                    const key = state.selectedItems[0]?.key;
                    if (renderValue) {
                        return renderValue(key);
                    }

                    const item = items.find((i) => String(i.id) === String(key));
                    return item?.content ? (item.textValue ?? item.label) : defaultChildren;
                }}
            </Select.Value>
            <Select.Indicator />
        </Select.Trigger>
        {description && <Description className='text-sm text-ink-faint'>{description}</Description>}
        {errorMessage && <FieldError className='text-sm text-danger'>{errorMessage}</FieldError>}
        <Select.Popover>
            <ListBox>
                {items.map((item) => (
                    <ListBox.Item
                        key={item.id}
                        id={item.id}
                        textValue={item.textValue ?? String(item.label)}
                    >
                        {item.content ?? item.label}
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                ))}
            </ListBox>
        </Select.Popover>
    </Select>
);

export default SelectField;
