import React, { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { pendingTiming, useOldestPending } from '../pendingActions';
import { chipClass } from './chipClass';

const ease = { duration: 0.3, ease: 'easeOut' };

// 'none', then 'waiting' once an action has waited chipAfter, then 'reload' at reloadAfter, so steady lag shows
// just the pulse on what was pressed
export const usePendingStage = () => {
    const oldest = useOldestPending();
    const [stage, setStage] = useState('none');

    useEffect(() => {
        setStage('none');
        if (oldest === null) {
            return;
        }
        const waited = performance.now() - oldest;
        const timers = [
            setTimeout(() => setStage('waiting'), Math.max(0, pendingTiming.chipAfter - waited)),
            setTimeout(() => setStage('reload'), Math.max(0, pendingTiming.reloadAfter - waited))
        ];
        return () => timers.forEach(clearTimeout);
    }, [oldest]);

    return stage;
};

// The prompt bar draws its options back on a click, so a press here stops there
const stopClick = (event) => event.stopPropagation();

// small: one line of the docked bar's title, so the reload is a link rather than a button
const PendingChip = ({ stage, small = false, className }) => (
    <div
        role='status'
        aria-label='Waiting for the server'
        data-pending-chip={stage}
        className={classNames(
            'flex items-center justify-center whitespace-nowrap text-[11px] leading-tight text-default-400',
            className
        )}
    >
        <FontAwesomeIcon icon={faCircleNotch} spin className='text-warning' />
        <span className='ml-1.5'>Waiting for server…</span>
        <AnimatePresence initial={false}>
            {stage === 'reload' && (
                // Widens into place, so the centred words beside it glide aside rather than jump
                <motion.div
                    key='reload'
                    className='overflow-hidden'
                    initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                    animate={{ opacity: 1, width: 'auto', marginLeft: 8 }}
                    exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                    transition={ease}
                    onClick={stopClick}
                >
                    {small ? (
                        <button
                            type='button'
                            className='font-semibold uppercase tracking-wide text-amber-300 underline underline-offset-2 hover:text-amber-100'
                            onClick={() => window.location.reload()}
                        >
                            Reload
                        </button>
                    ) : (
                        <Button
                            size='sm'
                            variant='bordered'
                            className={classNames(chipClass(false), 'h-6')}
                            onPress={() => window.location.reload()}
                        >
                            Reload
                        </Button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// Its own row above the prompt, growing in so the prompt slides down rather than jumps
export const PendingRow = ({ stage }) => (
    <AnimatePresence initial={false}>
        {stage !== 'none' && (
            <motion.div
                key='pending'
                className='overflow-hidden'
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={ease}
            >
                <PendingChip stage={stage} className='h-7 pb-1' />
            </motion.div>
        )}
    </AnimatePresence>
);

export default PendingChip;
