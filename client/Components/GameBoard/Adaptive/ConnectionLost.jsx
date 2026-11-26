import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { reconnectGameNow } from '../../../redux/reducers/game';
import { navigate } from '../../../redux/reducers/navigation';
import { Heading, OverlayBackdrop, OverlayButton } from './OverlayParts';

// A blip the socket recovers from at once never shows
export const lostShownAfter = 750;

const causes = {
    'io server disconnect': 'The game server closed the connection.',
    'ping timeout': 'The game server stopped responding.',
    'transport close': 'The connection to the game server dropped.',
    'transport error': 'The connection to the game server failed.'
};

const useOnline = () => {
    const [online, setOnline] = useState(() => navigator.onLine !== false);
    useEffect(() => {
        const update = () => setOnline(navigator.onLine !== false);
        window.addEventListener('online', update);
        window.addEventListener('offline', update);
        return () => {
            window.removeEventListener('online', update);
            window.removeEventListener('offline', update);
        };
    }, []);
    return online;
};

const useNow = (running) => {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        if (!running) {
            return;
        }
        setNow(Date.now());
        const timer = setInterval(() => setNow(Date.now()), 250);
        return () => clearInterval(timer);
    }, [running]);
    return now;
};

const duration = (ms) => {
    const seconds = Math.max(0, Math.floor(ms / 1000));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

// The socket does not try again by itself when the server closed it, until a reconnect it is asked for fails
const retries = (lost) => lost.reason !== 'io server disconnect' || lost.attempts > 0;

const status = (lost, online, now) => {
    if (lost.trying) {
        return lost.attempts > 1 ? `Reconnecting (attempt ${lost.attempts})…` : 'Reconnecting…';
    }
    if (!online) {
        return 'Waiting for your device to come back online.';
    }
    if (!retries(lost)) {
        return 'It will not reconnect by itself.';
    }
    const next =
        lost.retryAt === undefined
            ? 'shortly'
            : `in ${Math.max(1, Math.ceil((lost.retryAt - now) / 1000))}s`;
    if (lost.attempts === 0) {
        return `Reconnecting ${next}.`;
    }
    return `Attempt ${lost.attempts} failed. Trying again ${next}.`;
};

const ConnectionLost = () => {
    const dispatch = useDispatch();
    const lost = useSelector((state) => state.game.lost);
    const online = useOnline();
    const now = useNow(!!lost);
    const shown = !!lost && now - lost.at >= lostShownAfter;

    // Coming back online is the best moment to try, rather than waiting out the backoff
    useEffect(() => {
        if (lost && online) {
            dispatch(reconnectGameNow());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [online]);

    return (
        <AnimatePresence>
            {shown && (
                <motion.div
                    key='connection-lost'
                    role='alertdialog'
                    aria-modal='true'
                    aria-labelledby='connection-lost-title'
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className='overlay-root fixed inset-0 z-[500] overflow-hidden'
                    data-board-surface=''
                >
                    <OverlayBackdrop major />
                    <div className='absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center'>
                        <Heading id='connection-lost-title' className='overlay-text text-xl'>
                            Connection lost
                        </Heading>
                        <p className='overlay-text hud-zoom max-w-full text-balance text-sm font-semibold leading-snug text-ink-faint [text-shadow:0_1px_6px_#000]'>
                            {online
                                ? causes[lost.reason] ||
                                  'The connection to the game server dropped.'
                                : 'Your device is offline.'}
                        </p>
                        <p
                            aria-live='polite'
                            className='hud-zoom flex max-w-full items-center gap-2 rounded-full border border-danger/40 bg-panel/90 px-4 py-1.5 text-sm font-medium text-ink shadow-[0_6px_20px_rgba(0,0,0,0.6)]'
                        >
                            {lost.trying && (
                                <FontAwesomeIcon
                                    icon={faCircleNotch}
                                    spin
                                    className='text-warning'
                                />
                            )}
                            {status(lost, online, now)}
                        </p>
                        <p className='hud-zoom text-xs text-ink-faint [text-shadow:0_1px_6px_#000]'>
                            Disconnected for {duration(now - lost.at)}
                            {lost.error && !lost.trying && ` · ${lost.error}`}
                        </p>
                        <div className='hud-zoom mt-1 flex flex-wrap justify-center gap-2'>
                            <OverlayButton
                                primary
                                disabled={lost.trying}
                                onPress={() => dispatch(reconnectGameNow())}
                            >
                                Reconnect now
                            </OverlayButton>
                            <OverlayButton onPress={() => dispatch(navigate('/'))}>
                                Go to home page
                            </OverlayButton>
                        </div>
                        <p className='hud-zoom max-w-xs text-balance text-xs leading-snug text-ink-faint [text-shadow:0_1px_6px_#000]'>
                            {retries(lost) && 'It keeps trying to reconnect meanwhile. '}
                            Your game is still on the Play tab.
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConnectionLost;
