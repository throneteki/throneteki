import React from 'react';
import { ComboBox, Input, Label, ListBox } from '@heroui/react';
import classNames from 'classnames';

const ComboField = ({
    label,
    items,
    selectedKey,
    onSelectionChange,
    placeholder,
    className,
    'aria-label': ariaLabel
}) => (
    <ComboBox
        className={classNames('flex flex-col gap-1', className)}
        items={items}
        selectedKey={selectedKey ?? null}
        onSelectionChange={onSelectionChange}
        aria-label={label ? undefined : ariaLabel}
    >
        {label && <Label className='text-sm text-ink-dim'>{label}</Label>}
        <ComboBox.InputGroup>
            <Input placeholder={placeholder} />
            <ComboBox.Trigger />
        </ComboBox.InputGroup>
        <ComboBox.Popover>
            <ListBox>
                {(item) => (
                    <ListBox.Item id={item.id} textValue={item.textValue ?? String(item.label)}>
                        {item.content ?? item.label}
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                )}
            </ListBox>
        </ComboBox.Popover>
    </ComboBox>
);

export default ComboField;
