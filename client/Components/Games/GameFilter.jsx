import React, { useState } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@heroui/react';
import { GameFormats, GameTypes } from '../../constants';

const FilterChip = ({ label, isOn, onToggle }) => (
    <button
        type='button'
        aria-pressed={isOn}
        onClick={onToggle}
        className={classNames(
            'rounded-full border px-3 py-0.5 text-sm transition-colors duration-150',
            isOn
                ? 'border-gold-line bg-gold/10 text-ink'
                : 'border-edge text-ink-faint hover:text-ink-dim'
        )}
    >
        {label}
    </button>
);

const GameFilter = ({ filter, onFilterChanged }) => {
    const [isOpen, setIsOpen] = useState(false);
    const groups = [GameTypes, GameFormats];
    const hiddenCount = groups.flat().filter((item) => filter[item.name] === false).length;

    const toggle = (name) => onFilterChanged({ ...filter, [name]: filter[name] === false });

    return (
        <div className='flex flex-col gap-2'>
            <Button
                size='sm'
                variant='tertiary'
                className='self-start sm:hidden'
                aria-expanded={isOpen}
                onPress={() => setIsOpen(!isOpen)}
            >
                <FontAwesomeIcon icon={faFilter} />
                {hiddenCount > 0 ? `Filters (${hiddenCount} hidden)` : 'Filters'}
            </Button>
            <div
                role='group'
                aria-label='Show games'
                className={classNames('flex flex-wrap items-center gap-1.5', {
                    'max-sm:hidden': !isOpen
                })}
            >
                {groups.map((group, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <span aria-hidden className='mx-1.5 h-4 w-px bg-gold-hair' />}
                        {group.map((item) => (
                            <FilterChip
                                key={item.name}
                                label={item.label}
                                isOn={filter[item.name] !== false}
                                onToggle={() => toggle(item.name)}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default GameFilter;
