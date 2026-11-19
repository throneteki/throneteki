import React from 'react';
import classNames from 'classnames';
import { RadioGroup } from '@heroui/react';
import { useFormikContext } from 'formik';
import { RadioOption } from '../Site/RadioField';
import { GameTypeDescriptions } from './GameTypeInfo';
import { GameTypeDiamond } from './GameTypeMark';
import { GameTypes as gameTypes } from '../../constants';

const GameTypes = ({ isDisabled = false }) => {
    const { values, setFieldValue } = useFormikContext();

    return (
        <RadioGroup
            name='gameType'
            aria-label='Type of game'
            value={values.gameType ?? null}
            onChange={(value) => setFieldValue('gameType', value)}
            isDisabled={isDisabled}
            className='grid grid-cols-1 gap-2 sm:grid-cols-3'
        >
            {gameTypes.map((type) => (
                <RadioOption
                    key={type.name}
                    value={type.name}
                    className={classNames(
                        'border px-3.5 py-3 transition-colors duration-150',
                        values.gameType === type.name
                            ? 'border-gold-line bg-accent/[0.08]'
                            : 'border-gold-hair hover:border-gold-line'
                    )}
                    contentClassName='items-start gap-3 cursor-pointer'
                >
                    <span className='flex flex-col gap-0.5'>
                        <span className='flex items-center gap-2 text-ink'>
                            <GameTypeDiamond gameType={type.name} />
                            {type.label}
                        </span>
                        <span className='text-sm text-ink-faint'>
                            {GameTypeDescriptions[type.name]}
                        </span>
                    </span>
                </RadioOption>
            ))}
        </RadioGroup>
    );
};

export default GameTypes;
