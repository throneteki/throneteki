import React from 'react';
import SelectField from '../Site/SelectField';
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
    const handleChange = (value) => {
        let legalityObj = null;
        if (value === 'latest') {
            legalityObj = data.find(
                (rl) => rl.format === format && rl.variant === variant && rl.active
            );
        } else {
            legalityObj = data.find((rl) => rl._id === value);
        }
        onSelected(value, legalityObj);
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
        if (!data) {
            return;
        }

        // If legality no longer exists after data is updated, default it to latest, custom, or undefined
        let legality = legalities?.find((rl) => rl._id === selected);
        let legalityObj = data?.find((rl) => rl._id === selected);
        if (!legality) {
            const activeLegality = data?.find(
                (rl) => rl.format === format && rl.variant === variant && rl.active
            );
            if (activeLegality) {
                legality = 'latest';
                legalityObj = activeLegality;
            } else if (legalities?.some((rl) => rl._id === 'custom')) {
                legality = 'custom';
                legalityObj = null;
            }
            onSelected(legality, legalityObj);
        }
    }, [allowCustom, data, format, legalities, onSelected, selected, variant]);

    return (
        <SelectField
            label={label}
            value={selected || null}
            onChange={handleChange}
            isDisabled={
                isDisabled || isLoading || (!disallowEmptySelection && legalities.length === 0)
            }
            isInvalid={isInvalid}
            errorMessage={errorMessage}
            className={className}
            style={style}
            items={legalities.map((l) => ({
                id: l._id,
                label: l.label,
                textValue: `${l.label}${l._id === 'latest' ? ` (${l.description})` : ''}`,
                content: (
                    <div className='flex flex-col'>
                        <span className='text-base'>{l.label}</span>
                        <span className='text-xs'>{l.description}</span>
                    </div>
                )
            }))}
        />
    );
};

export default LegalitySelect;
