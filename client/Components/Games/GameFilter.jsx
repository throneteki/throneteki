import React, { useState } from 'react';
import { Divider, Switch } from '@heroui/react';
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
            <div className='flex flex-wrap gap-2'>
                <div className='flex flex-wrap gap-2 justify-start'>
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
                <Divider orientation='vertical' />
                <div className='flex flex-warp gap-2 justify-start'>
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
                <Divider orientation='vertical' />
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
