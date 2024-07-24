import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';
import {
    cancelPasswordJoin,
    sendJoinGameMessage,
    sendWatchGameMessage
} from '../../redux/reducers/lobby';

const PasswordGame = () => {
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { passwordJoinType, passwordGame, passwordError } = useSelector((state) => state.lobby);

    const onJoinClick = useCallback(
        (event) => {
            event.preventDefault();

            if (!passwordGame?.id) {
                return;
            }

            if (passwordJoinType === 'Join') {
                dispatch(sendJoinGameMessage(passwordGame.id, password));
            } else if (passwordJoinType === 'Watch') {
                sendWatchGameMessage(passwordGame.id, password);
            }
        },
        [passwordJoinType, dispatch, passwordGame?.id, password]
    );

    const onCancelClick = useCallback(
        (event) => {
            dispatch(cancelPasswordJoin());

            event.preventDefault();
        },
        [dispatch]
    );

    const onPasswordChange = useCallback((event) => {
        setPassword(event.target.value);
    }, []);

    if (!passwordGame) {
        return null;
    }

    return (
        <div>
            <Panel title={passwordGame.name}>
                <div>
                    <h3>Enter the password</h3>
                </div>
                <div className='game-password'>
                    <input
                        className='form-control'
                        type='password'
                        onChange={onPasswordChange}
                        value={password}
                    />
                </div>
                {passwordError ? (
                    <div>
                        <AlertPanel type='error' message={passwordError} />
                    </div>
                ) : null}
                <div>
                    <div className='btn-group'>
                        <button className='btn btn-primary' onClick={onJoinClick}>
                            {passwordJoinType}
                        </button>
                        <button className='btn btn-primary' onClick={onCancelClick}>
                            Cancel
                        </button>
                    </div>
                </div>
            </Panel>
        </div>
    );
};

export default PasswordGame;
