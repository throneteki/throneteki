import React from 'react';
import GameTypeInfo from './GameTypeInfo';
import { Radio, RadioGroup } from '@heroui/react';
import { GameTypes as gameTypes } from '../../constants';

const GameTypes = ({ formProps, isDisabled }) => {
    return (
        <div className='flex flex-col gap-2'>
            <RadioGroup
                name='gameType'
                label={'Type'}
                orientation='horizontal'
                value={formProps.values.gameType}
                onValueChange={(value) => formProps.setFieldValue('gameType', value)}
                isDisabled={isDisabled}
            >
                {gameTypes.map((type) => (
                    <Radio key={type.name} id={type.name} value={type.name}>
                        {type.label}
                    </Radio>
                ))}
            </RadioGroup>
            <GameTypeInfo gameType={formProps.values.gameType} />
        </div>
    );
};

export default GameTypes;
