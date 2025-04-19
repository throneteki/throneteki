import React from 'react';
import Panel from '../Site/Panel';
import { Radio, RadioGroup } from '@heroui/react';
import CardImage from '../Images/CardImage';

export const allowedCardSizes = [
    // { name: 'auto', label: 'Auto' },
    { name: 'small', label: 'Small' },
    { name: 'normal', label: 'Normal' },
    { name: 'large', label: 'Large' },
    { name: 'x-large', label: 'Extra-Large' }
];

const CardSizeSettings = ({ formProps }) => {
    return (
        <Panel title='Card Image Size'>
            <div className='flex gap-2'>
                <RadioGroup
                    value={formProps.values.cardSize}
                    onValueChange={(value) => formProps.setFieldValue('cardSize', value)}
                >
                    {allowedCardSizes.map(({ name, label }) => (
                        <Radio key={name} value={name}>
                            {label}
                        </Radio>
                    ))}
                </RadioGroup>
                <CardImage
                    code='cardback'
                    size={formProps.values.cardSize}
                    className='transition-all'
                />
            </div>
        </Panel>
    );
};

export default CardSizeSettings;
