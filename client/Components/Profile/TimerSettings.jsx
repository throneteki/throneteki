import React from 'react';
import Panel from '../Site/Panel';
import { Input, Slider, Switch } from '@heroui/react';

const TimerSettings = ({ formProps }) => {
    return (
        <Panel title='Timed Interrupt Window'>
            <div className='flex flex-col gap-2'>
                <p className='text-sm'>
                    Every time a game event occurs that you could possibly interrupt to cancel it, a
                    timer will count down. At the end of that timer, the window will automatically
                    pass. This option controls the duration of the timer. The timer can be configure
                    to show when events are played (useful if you play cards like The Hand&apos;s
                    Judgement) and to show when card abilities are triggered (useful if you play a
                    lot of Treachery).
                </p>
                <div>
                    <label className='font-bold'>Window timeout (seconds)</label>
                    <div className='flex items-center gap-2'>
                        <Slider
                            color='primary'
                            step={1}
                            maxValue={10}
                            defaultValue={formProps.values.windowTimer}
                            value={formProps.values.windowTimer}
                            onChange={(value) => formProps.setFieldValue('windowTimer', value)}
                        />
                        <Input
                            className='w-24'
                            type='number'
                            max={10}
                            min={1}
                            {...formProps.getFieldProps('windowTimer')}
                            onValueChange={(value) => {
                                value = parseInt(value);

                                if (isNaN(value)) {
                                    return;
                                }

                                if (value > 10) {
                                    value = 10;
                                }

                                formProps.setFieldValue('windowTimer', value);
                            }}
                        />
                    </div>
                </div>
                <div className='grid md:grid-cols-2 gap-2'>
                    <Switch
                        {...formProps.getFieldProps('timerEvents')}
                        isSelected={formProps.values.timerEvents}
                    >
                        Show timer for events
                    </Switch>
                    <Switch
                        {...formProps.getFieldProps('timerAbilities')}
                        isSelected={formProps.values.timerAbilities}
                    >
                        Show timer for card abilities
                    </Switch>
                </div>
            </div>
        </Panel>
    );
};

export default TimerSettings;
