import React from 'react';
import { Button } from '@nextui-org/react';
import { useSelector } from 'react-redux';

const GameButtons = ({ onNewGame }) => {
    const user = useSelector((state) => state.auth.user);

    return (
        <>
            <Button disabled={!user} color='primary' onClick={() => onNewGame && onNewGame()}>
                New Game
            </Button>
            <Button
                className='mt-2'
                disabled={!user}
                color='primary'
                onClick={() => {
                    // setQuickJoin(true);
                    // dispatch(startNewGame());
                }}
            >
                Quick Join
            </Button>
        </>
    );
};

export default GameButtons;
