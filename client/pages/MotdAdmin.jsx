import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Panel from '../Components/Site/Panel';
import TextArea from '../Components/Form/TextArea';
import RadioGroup from '../Components/Form/RadioGroup';
import { sendMotdMessage } from '../redux/reducers/lobby';

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
        <div className='col-sm-offset-2 col-sm-8'>
            <Panel title='Motd administration'>
                <TextArea
                    fieldClass='col-xs-12'
                    name='motd'
                    value={motdText}
                    onChange={onMotdTextChange}
                    rows='4'
                    placeholder='Enter a motd message'
                />
                <div className='col-xs-12'>
                    <RadioGroup
                        buttons={motdTypes}
                        onValueSelected={onMotdTypeChange}
                        value={selectedMotdType}
                    />
                </div>

                <button
                    className='btn btn-primary col-xs-2 motd-button'
                    type='button'
                    onClick={onSaveClick}
                >
                    Save
                </button>
            </Panel>
        </div>
    );
};

export default MotdAdmin;
