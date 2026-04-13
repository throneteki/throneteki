import React from 'react';
import GameTypeInfo from './GameTypeInfo';
import { Radio, RadioGroup } from '@heroui/react';
import { GameTypes as gameTypes } from '../../constants';
import { useFormikContext } from 'formik';

const GameTypes = ({ isDisabled }) => {
    const { values, setFieldValue } = useFormikContext();
    return (
        <div className='flex flex-col gap-2'>
            <RadioGroup
                name='gameType'
                label={'Type'}
                orientation='horizontal'
                value={values.gameType}
                onValueChange={(value) => setFieldValue('gameType', value)}
                isDisabled={isDisabled}
            >
                {gameTypes.map((type) => (
                    <Radio key={type.name} id={type.name} value={type.name}>
                        {type.label}
                    </Radio>
                ))}
            </RadioGroup>
            <GameTypeInfo gameType={values.gameType} />
        </div>
    );
};

export default GameTypes;
