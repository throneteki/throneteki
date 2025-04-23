import React, { useState } from 'react';
import { Switch } from '@heroui/react';
import Panel from '../Site/Panel';
import { GameFormats, GameTypes } from '../../constants';

const GameFilter = ({ filter, onFilterChanged }) => {
    const [currentFilter, setCurrentFilter] = useState(filter);

    const onFilterChecked = (name, checked) => {
        currentFilter[name] = checked;
        const newFilter = Object.assign({}, currentFilter);

        setCurrentFilter(newFilter);

        onFilterChanged && onFilterChanged(newFilter);
    };

    return (
        <Panel type='primary'>
            <div className='h-full flex flex-col md:flex-row gap-2 md:items-center'>
                <div className='flex gap-2 flex-wrap'>
                    {GameTypes.map((filter) => (
                        <div key={filter.name}>
                            <Switch
                                id={filter.name}
                                onValueChange={(isSelected) => {
                                    onFilterChecked(filter.name, isSelected);
                                }}
                                isSelected={currentFilter[filter.name]}
                            >
                                {filter.label}
                            </Switch>
                        </div>
                    ))}
                </div>
                <div className='flex gap-2 flex-wrap'>
                    {GameFormats.map((filter) => (
                        <div key={filter.name}>
                            <Switch
                                id={filter.name}
                                onValueChange={(isSelected) => {
                                    onFilterChecked(filter.name, isSelected);
                                }}
                                isSelected={currentFilter[filter.name]}
                            >
                                {filter.label}
                            </Switch>
                        </div>
                    ))}
                </div>
                <Switch
                    id='onlyShowNew'
                    onValueChange={(isSelected) => {
                        onFilterChecked('onlyShowNew', isSelected);
                    }}
                    isSelected={currentFilter['onlyShowNew']}
                >
                    {'Only show new games'}
                </Switch>
            </div>
        </Panel>
    );
};

export default GameFilter;
