import React, { useState, useCallback, forwardRef } from 'react';
import Field from '../Site/Field';
import { useDispatch, useSelector } from 'react-redux';

import Frame from '../Site/Frame';
import Notice from '../Site/Notice';
import {
    cancelPasswordJoin,
    sendJoinGameMessage,
    sendWatchGameMessage
} from '../../redux/reducers/lobby';
import { Button } from '@heroui/react';

const PasswordGame = forwardRef(function PasswordGame(_, ref) {
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { passwordJoinType, passwordGame, passwordError } = useSelector((state) => state.lobby);

    const onJoinClick = useCallback(() => {
        if (!passwordGame?.id) {
            return;
        }
        if (passwordJoinType === 'Join') {
            dispatch(sendJoinGameMessage(passwordGame.id, password));
        } else if (passwordJoinType === 'Watch') {
            dispatch(sendWatchGameMessage(passwordGame.id, password));
        }
    }, [passwordJoinType, dispatch, passwordGame?.id, password]);

    const onCancelClick = useCallback(() => {
        dispatch(cancelPasswordJoin());
    }, [dispatch]);

    if (!passwordGame) {
        return null;
    }

    return (
        <Frame
            title={passwordGame.name}
            description={`This game has a password. Enter it to ${passwordJoinType === 'Watch' ? 'watch' : 'join'}.`}
            ref={ref}
            bodyClassName='gap-4'
        >
            {passwordError && <Notice kind='error'>{passwordError}</Notice>}
            <form
                className='flex flex-wrap items-end gap-3'
                onSubmit={(event) => {
                    event.preventDefault();
                    onJoinClick();
                }}
            >
                <Field
                    autoComplete='off'
                    type='password'
                    onValueChange={setPassword}
                    value={password}
                    label='Password'
                    className='w-full max-w-xs'
                    autoFocus
                />
                <div className='flex gap-2'>
                    <Button onPress={onCancelClick} variant='tertiary'>
                        Cancel
                    </Button>
                    <Button type='submit' variant='primary'>
                        {passwordJoinType}
                    </Button>
                </div>
            </form>
        </Frame>
    );
});

export default PasswordGame;
