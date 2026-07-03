import React from 'react';
import { Select, SelectItem } from '@heroui/react';
import { GameFormats } from '../../constants';
import { useEffect, useMemo } from 'react';

const VariantSelect = ({
    className,
    style,
    label = 'Variant',
    format,
    selected,
    onSelected,
    isInvalid,
    errorMessage,
    disallowEmptySelection,
    isDisabled
}) => {
    const handleChange = (e) => {
        onSelected(e.target.value);
    };
    const variants = useMemo(
        () => GameFormats.find(({ name }) => name === format)?.variants ?? [],
        [format]
    );

    // Defaults to first on formats list
    useEffect(() => {
        const newVariant =
            GameFormats.find(({ name }) => name === format)?.variants?.[0]?.name ?? null;
        onSelected(newVariant);
    }, [format, onSelected]);

    return (
        <Select
            label={label}
            selectedKeys={selected ? [selected] : []}
            onChange={handleChange}
            isDisabled={isDisabled || (!disallowEmptySelection && variants.length === 0)}
            isInvalid={isInvalid}
            errorMessage={errorMessage}
            disallowEmptySelection={disallowEmptySelection}
            className={className}
            style={style}
        >
            {variants.map((v) => (
                <SelectItem key={v.name} value={v.name}>
                    {v.label}
                </SelectItem>
            ))}
        </Select>
    );
};

export default VariantSelect;
