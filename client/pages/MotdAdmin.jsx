import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@heroui/react';

import { TextAreaField } from '../Components/Site/Field';
import Group from '../Components/Site/Group';
import Notice from '../Components/Site/Notice';
import RadioField from '../Components/Site/RadioField';
import { sendMotdMessage } from '../redux/reducers/lobby';
import { getMessageWithLinks } from '../util';
import AdminPage from './AdminPage';

const MotdTypes = [
    { value: 'info', label: 'Info' },
    { value: 'success', label: 'Good news' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Problem' }
];

const MotdAdmin = () => {
    const motd = useSelector((state) => state.lobby.motd);
    const dispatch = useDispatch();

    const [motdText, setMotdText] = useState(motd?.message ?? '');
    const [motdType, setMotdType] = useState(motd?.motdType ?? 'info');

    useEffect(() => {
        setMotdText(motd?.message ?? '');
        setMotdType(motd?.motdType ?? 'info');
    }, [motd]);

    const liveText = motd?.message ?? '';
    const isChanged = motdText !== liveText || (!!motdText && motdType !== motd?.motdType);
    const publish = (message, type) => dispatch(sendMotdMessage({ message, motdType: type }));

    return (
        <AdminPage
            section='motd'
            title='Message of the day'
            description='One line at the top of the lobby, shown to everyone as soon as you publish it.'
            footer={
                <div className='flex flex-wrap items-center gap-3'>
                    <span className={isChanged ? 'text-sm text-warning' : 'text-sm text-ink-faint'}>
                        {isChanged
                            ? 'Not published yet'
                            : liveText
                              ? 'This is the live message'
                              : 'No message is showing'}
                    </span>
                    <div className='ms-auto flex gap-2'>
                        <Button
                            variant='tertiary'
                            isDisabled={!liveText}
                            onPress={() => publish('', motdType)}
                        >
                            Clear
                        </Button>
                        <Button
                            variant='primary'
                            isDisabled={!isChanged}
                            onPress={() => publish(motdText, motdType)}
                        >
                            Publish
                        </Button>
                    </div>
                </div>
            }
        >
            <Group title='Message'>
                <div className='flex flex-col gap-4'>
                    <TextAreaField
                        aria-label='Message'
                        value={motdText}
                        onValueChange={setMotdText}
                        minRows={3}
                        placeholder='Nothing shows while this is empty'
                    />
                    <RadioField
                        label='Type'
                        orientation='horizontal'
                        value={motdType}
                        onChange={setMotdType}
                        options={MotdTypes}
                    />
                </div>
            </Group>
            <Group title='Preview' description='How it will look in the lobby.'>
                {motdText ? (
                    <Notice kind={motdType} isBoxed>
                        {getMessageWithLinks(motdText)}
                    </Notice>
                ) : (
                    <p className='text-sm text-ink-faint'>Nothing will show.</p>
                )}
            </Group>
        </AdminPage>
    );
};

export default MotdAdmin;
