import React from 'react';
import SelectField from '../Site/SelectField';
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
    const handleChange = (value) => {
        onSelected(value);
    };
    const variants = useMemo(
        () => GameFormats.find(({ name }) => name === format)?.variants ?? [],
        [format]
    );

    useEffect(() => {
        if (!variants.some((variant) => variant.name === selected)) {
            onSelected(variants[0]?.name ?? null);
        }
    }, [variants, selected, onSelected]);

    return (
        <SelectField
            label={label}
            value={selected || null}
            onChange={handleChange}
            isDisabled={isDisabled || (!disallowEmptySelection && variants.length === 0)}
            isInvalid={isInvalid}
            errorMessage={errorMessage}
            className={className}
            style={style}
            items={variants.map((v) => ({ id: v.name, label: v.label }))}
        />
    );
};

export default VariantSelect;
