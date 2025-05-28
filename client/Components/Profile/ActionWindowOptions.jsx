import { Switch } from '@heroui/react';
import React, { useMemo } from 'react';
import Panel from '../Site/Panel';

const windows = [
    { name: 'plot', label: 'Plots revealed' },
    { name: 'draw', label: 'Draw phase' },
    { name: 'challengeBegin', label: 'Before challenge' },
    { name: 'attackersDeclared', label: 'Attackers declared' },
    { name: 'defendersDeclared', label: 'Defenders declared' },
    { name: 'dominance', label: 'Dominance phase' },
    { name: 'standing', label: 'Standing phase' },
    { name: 'taxation', label: 'Taxation phase' }
];

// eslint-disable-next-line react/display-name
const ActionWindowOptions = ({ formProps }) => {
    const retWindows = useMemo(() => {
        return windows.map((window) => {
            return (
                <Switch
                    key={window.name}
                    {...formProps.getFieldProps(`actionWindows.${window.name}`)}
                    isSelected={formProps.values.actionWindows[window.name]}
                >
                    {window.label}
                </Switch>
            );
        });
    }, [formProps]);

    return (
        <Panel title='Action window defaults'>
            <div className='flex flex-col gap-2'>
                <p className='text-sm'>
                    If an option is selected here, you will always be prompted if you want to take
                    an action in that window. If an option is not selected, you will receive no
                    prompts for that window. For some windows (e.g. dominance) this could mean the
                    whole window is skipped.
                </p>
                <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-2'>{retWindows}</div>
            </div>
        </Panel>
    );
};

export default ActionWindowOptions;
