import { ButtonGroup } from '@heroui/react';
import React from 'react';
import { Constants } from '../../constants';
import { SmallButton } from '../Site/Variants';

const FactionFilter = ({ className, filter, setFilter, factions = Constants.Factions }) => {
    return (
        <ButtonGroup className={className}>
            {factions.map((faction) => {
                return (
                    <SmallButton
                        key={faction.value}
                        size='xs'
                        color={filter.some((f) => f === faction.value) ? 'primary' : null}
                        onPress={() =>
                            setFilter(
                                filter.some((f) => f === faction.value)
                                    ? filter.filter((f) => f !== faction.value)
                                    : filter.concat(faction.value)
                            )
                        }
                    >
                        <span
                            className={`icon icon-${faction.value} ${Constants.FactionColorMaps[faction.value]}`}
                        ></span>
                    </SmallButton>
                );
            })}
        </ButtonGroup>
    );
};

export default FactionFilter;
