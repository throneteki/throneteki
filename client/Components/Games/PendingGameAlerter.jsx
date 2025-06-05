import React, { useEffect, useRef, useState } from 'react';
import ChargeMp3 from '../../assets/sound/charge.mp3';
import ChargeOgg from '../../assets/sound/charge.ogg';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const PendingGameAlerter = ({ game, user }) => {
    const notificationRef = useRef(null);
    const path = useSelector((state) => state.navigation.path);
    const [waitingPlayerNames, setWaitingPlayerNames] = useState(
        Object.values(game.players).map((player) => player.name) || []
    );
    useEffect(() => {
        if (!user) {
            return;
        }

        const players = Object.values(game.players);

        if (waitingPlayerNames.length !== players.length) {
            const newPlayers = players.filter(
                (p) => !waitingPlayerNames.some((pn) => pn === p.name)
            );

            if (newPlayers.some((p) => p.name !== user.username)) {
                const promise = notificationRef.current.play();
                if (promise !== undefined) {
                    promise.catch(() => {}).then(() => {});
                }

                for (const newPlayer of newPlayers) {
                    const joinMessage = `${newPlayer.name} has joined your game`;
                    // Always toast
                    toast.info(joinMessage);

                    // Send browser notification, if able
                    if (window.Notification && Notification.permission === 'granted') {
                        const windowNotification = new Notification('The Iron Throne', {
                            body: joinMessage,
                            icon: `/img/avatar/${newPlayer.username}.png`
                        });

                        setTimeout(() => windowNotification.close(), 5000);
                    }
                }
            }

            setWaitingPlayerNames(players.map((p) => p.name));
        }
    }, [user, game, path, waitingPlayerNames]);
    return (
        <audio ref={notificationRef}>
            <source src={ChargeMp3} type='audio/mpeg' />
            <source src={ChargeOgg} type='audio/ogg' />
        </audio>
    );
};

export default PendingGameAlerter;
