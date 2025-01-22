import React from 'react';
import GameTypeInfo from './GameTypeInfo';
import { Radio, RadioGroup } from '@heroui/react';

const GameTypes = ({ formProps }) => {
    const types = [
        { name: 'beginner', label: 'Beginner' },
        { name: 'casual', label: 'Casual' },
        { name: 'competitive', label: 'Competitive' }
    ];

    return (
        <>
            <div>
                <GameTypeInfo gameType={formProps.values.gameType} />
            </div>
            <div className='mt-2'>
                <RadioGroup
                    name='gameType'
                    label={'Type'}
                    orientation='horizontal'
                    value={formProps.values.gameType}
                    onValueChange={(value) => formProps.setFieldValue('gameType', value)}
                >
                    {types.map((type) => (
                        <Radio
                            key={type.name}
                            id={type.name}
                            //         onChange={formProps.handleChange}
                            value={type.name}
                        >
                            {type.label}
                        </Radio>
                    ))}
                </RadioGroup>
            </div>
        </>
    );
};

export default GameTypes;
