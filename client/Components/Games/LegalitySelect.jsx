import React from 'react';
import { Select, SelectItem } from '@heroui/react';
import { useEffect, useMemo } from 'react';
import { useGetRestrictedListQuery } from '../../redux/middleware/api';

const LegalitySelect = ({
    className,
    style,
    label = 'Legality',
    format,
    variant,
    selected,
    onSelected,
    isInvalid,
    errorMessage,
    disallowEmptySelection,
    allowCustom,
    isDisabled
}) => {
    const { data, isLoading } = useGetRestrictedListQuery();
    const handleChange = (e) => {
        let legalityObj = null;
        if (e.target.value === 'latest') {
            legalityObj = data.find(
                (rl) => rl.format === format && rl.variant === variant && rl.active
            );
        } else {
            legalityObj = data.find((rl) => rl._id === e.target.value);
        }
        onSelected(e.target.value, legalityObj);
    };
    const legalities = useMemo(() => {
        if (!format || !variant || !data) {
            return [];
        }
        const latestActive = data.find(
            (rl) => rl.format === format && rl.variant === variant && rl.active
        );
        return [
            ...(allowCustom ? [{ _id: 'custom', label: 'Custom' }] : []),
            ...(latestActive
                ? [{ _id: 'latest', label: 'Latest', description: latestActive.version }]
                : []),
            ...(data
                .filter((rl) => rl.format === format && rl.variant === variant)
                .map((rl) => ({
                    _id: rl._id,
                    label: rl.version,
                    description: rl.issuer
                })) ?? [])
        ];
    }, [allowCustom, data, format, variant]);

    useEffect(() => {
        // If legality no longer exists after data is updated, default it to latest, custom, or undefined
        let legality = legalities?.find((rl) => rl._id === selected);
        let legalityObj = data?.find((rl) => rl._id === selected);
        if (!legalityObj) {
            const activeLegality = data?.find(
                (rl) => rl.format === format && rl.variant === variant && rl.active
            );
            if (activeLegality) {
                legality = 'latest';
                legalityObj = activeLegality;
            } else if (allowCustom) {
                legality = 'custom';
                legalityObj = null;
            }
            onSelected(legality, legalityObj);
        }
    }, [allowCustom, data, format, legalities, onSelected, selected, variant]);

    return (
        <Select
            label={label}
            selectedKeys={selected ? [selected] : []}
            onChange={handleChange}
            isDisabled={isDisabled || (!disallowEmptySelection && legalities.length === 0)}
            isInvalid={isInvalid}
            errorMessage={errorMessage}
            disallowEmptySelection={disallowEmptySelection}
            isLoading={isLoading}
            className={className}
            style={style}
        >
            {legalities.map((l) => (
                <SelectItem
                    key={l._id}
                    value={l._id}
                    textValue={`${l.label}${l._id === 'latest' ? ` (${l.description})` : ''}`}
                >
                    <div className='flex flex-col'>
                        <span className='text-md'>{l.label}</span>
                        <span className='text-xs'>{l.description}</span>
                    </div>
                </SelectItem>
            ))}
        </Select>
    );
};

export default LegalitySelect;
