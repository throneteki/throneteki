import { Button, ButtonGroup } from '@heroui/react';
import React from 'react';
import { Constants } from '../../constants';
import ThronesIcon from '../GameBoard/ThronesIcon';

const CardTypeFilter = ({ className, filter, setFilter, types = Constants.CardTypes }) => {
    return (
        <ButtonGroup className={className}>
            {types.map((type) => {
                return (
                    <Button
                        key={type.value}
                        size='sm'
                        isIconOnly
                        aria-label={type.name}
                        aria-pressed={filter.some((t) => t === type.value)}
                        variant={filter.some((t) => t === type.value) ? 'primary' : 'tertiary'}
                        onPress={() =>
                            setFilter(
                                filter.some((t) => t === type.value)
                                    ? filter.filter((t) => t !== type.value)
                                    : filter.concat(type.value)
                            )
                        }
                    >
                        <ThronesIcon icon={type.value} />
                    </Button>
                );
            })}
        </ButtonGroup>
    );
};

export default CardTypeFilter;
