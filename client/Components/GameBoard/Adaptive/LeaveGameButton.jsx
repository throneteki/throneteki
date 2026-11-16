import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import ConfirmDialog from '../../Site/ConfirmDialog';
import { sendLeaveGameMessage } from '../../../redux/reducers/game';

// Stands in for the navbar's Leave Game while the adaptive board hides the navbar, until the game menu replaces it
const LeaveGameButton = () => {
    const dispatch = useDispatch();
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.auth.user);
    const [confirming, setConfirming] = useState(false);

    const onLeave = () => {
        const everyone = Object.values({ ...currentGame.players, ...currentGame.spectators });
        if (user && everyone.some((a) => a.name === user.username && !a.canSafelyLeave)) {
            setConfirming(true);
            return;
        }
        dispatch(sendLeaveGameMessage());
    };

    return (
        <>
            <Button isIconOnly size='sm' variant='light' title='Leave Game' onPress={onLeave}>
                <FontAwesomeIcon icon={faRightFromBracket} />
            </Button>
            <ConfirmDialog
                isOpen={confirming}
                message='Your game is not finished, and you will automatically concede when leaving. Are you sure you want to leave?'
                onOpenChange={setConfirming}
                onCancel={() => setConfirming(false)}
                onOk={async () => {
                    dispatch(sendLeaveGameMessage());
                }}
            />
        </>
    );
};

export default LeaveGameButton;
