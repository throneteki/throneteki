import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Panel from '../Components/Site/Panel';
import { sendMotdMessage } from '../redux/reducers/lobby';
import { Button, Radio, RadioGroup, Textarea } from '@nextui-org/react';

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

    const onSaveClick = useCallback(
        (event) => {
            event.preventDefault();

            dispatch(
                sendMotdMessage({
                    message: motdText,
                    motdType: selectedMotdType
                })
            );
        },
        [dispatch, motdText, selectedMotdType]
    );

    return (
        <div className='w-2/3 mx-auto'>
            <Panel title='Motd administration'>
                <Textarea
                    name='motd'
                    value={motdText}
                    onValueChange={onMotdTextChange}
                    rows='4'
                    placeholder='Enter a motd message'
                />
                <div className='mt-2'>
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
                </div>

                <div className='mt-2'>
                    <Button color='primary' type='button' onClick={onSaveClick}>
                        Save
                    </Button>
                </div>
            </Panel>
        </div>
    );
};

export default MotdAdmin;
