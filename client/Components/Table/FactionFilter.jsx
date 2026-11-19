import { Button, ButtonGroup } from '@heroui/react';
import React from 'react';
import { Constants } from '../../constants';
import ThronesIcon from '../GameBoard/ThronesIcon';

const FactionFilter = ({ className, filter, setFilter, factions = Constants.Factions }) => {
    return (
        <ButtonGroup className={className}>
            {factions.map((faction) => {
                return (
                    <Button
                        key={faction.value}
                        size='sm'
                        isIconOnly
                        aria-label={faction.name}
                        aria-pressed={filter.some((f) => f === faction.value)}
                        variant={filter.some((f) => f === faction.value) ? 'primary' : 'tertiary'}
                        onPress={() =>
                            setFilter(
                                filter.some((f) => f === faction.value)
                                    ? filter.filter((f) => f !== faction.value)
                                    : filter.concat(faction.value)
                            )
                        }
                    >
                        <ThronesIcon icon={faction.value} />
                    </Button>
                );
            })}
        </ButtonGroup>
    );
};

export default FactionFilter;
