import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Panel from '../Components/Site/Panel';
import { sendMotdMessage } from '../redux/reducers/lobby';
import { Button, Radio, RadioGroup, Textarea } from '@heroui/react';
import Page from './Page';

const MotdAdmin = () => {
    const motd = useSelector((state) => state.lobby.motd);
    const dispatch = useDispatch();

    const [motdText, setMotdText] = useState(motd?.message);
    const [selectedMotdType, setSelectedMotdType] = useState(motd ? motd.motdType : 'info');

    const motdTypes = [
        { value: 'error', label: 'Error (red)' },
        { value: 'warning', label: 'Warning (yellow)' },
        { value: 'info', label: 'Info (blue)' },
        { value: 'success', label: 'Success (green)' }
    ];

    useEffect(() => {
        setMotdText(motd?.message);
        setSelectedMotdType(motd ? motd.motdType : 'info');
    }, [motd]);

    const onMotdTextChange = useCallback((event) => {
        setMotdText(event.target.value);
    }, []);

    const onMotdTypeChange = useCallback((value) => {
        setSelectedMotdType(value);
    }, []);

    const onSaveClick = useCallback(() => {
        dispatch(
            sendMotdMessage({
                message: motdText,
                motdType: selectedMotdType
            })
        );
    }, [dispatch, motdText, selectedMotdType]);

    return (
        <Page>
            <Panel title='Motd administration'>
                <div className='flex flex-col gap-2'>
                    <Textarea
                        name='motd'
                        value={motdText}
                        onValueChange={onMotdTextChange}
                        rows='4'
                        placeholder='Enter a motd message'
                    />
                    <RadioGroup
                        orientation='horizontal'
                        buttons={motdTypes}
                        onValueChange={onMotdTypeChange}
                        value={selectedMotdType}
                    >
                        <Radio value='error'>Error (Red)</Radio>
                        <Radio value='warning'>Warning (Yellow)</Radio>
                        <Radio value='info'>Info (Blue)</Radio>
                        <Radio value='success'>Success (Green)</Radio>
                    </RadioGroup>
                    <Button
                        color='primary'
                        type='button'
                        className='self-start'
                        onPress={onSaveClick}
                    >
                        Save
                    </Button>
                </div>
            </Panel>
        </Page>
    );
};

export default MotdAdmin;
