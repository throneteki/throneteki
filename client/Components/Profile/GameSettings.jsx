import React from 'react';
import Panel from '../Site/Panel';
import { Switch } from "@heroui/react";

const GameSettings = ({ formProps }) => {
    return (
        <Panel title='Game Settings'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
                <Switch
                    {...formProps.getFieldProps('chooseOrder')}
                    isSelected={formProps.values.chooseOrder}
                >
                    Choose order of keywords
                </Switch>
                <Switch
                    {...formProps.getFieldProps('chooseCards')}
                    isSelected={formProps.values.chooseCards}
                >
                    Make keywords optional
                </Switch>
                <Switch
                    {...formProps.getFieldProps('promptDupes')}
                    isSelected={formProps.values.promptDupes}
                >
                    Prompt before using dupes to save
                </Switch>
            </div>
        </Panel>
    );
};

export default GameSettings;
