import React from 'react';
import { Button } from '@heroui/react';
import { useSelector } from 'react-redux';

const GameButtons = ({ onNewGame, onQuickJoin }) => {
    const user = useSelector((state) => state.auth.user);

    return (
        <div className='flex lg:flex-col flex-row gap-2'>
            <Button isDisabled={!user} color='primary' onPress={() => onNewGame && onNewGame()}>
                New Game
            </Button>
            <Button
                disabled={!user}
                color='primary'
                onPress={() => {
                    onQuickJoin && onQuickJoin();
                }}
            >
                Quick Join
            </Button>
        </div>
    );
};

export default GameButtons;
