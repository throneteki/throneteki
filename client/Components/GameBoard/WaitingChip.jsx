import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const ease = { duration: 0.3, ease: 'easeOut' };

const WaitingChip = ({ className }) => (
    <div
        role='status'
        className={classNames(
            'flex items-center justify-center whitespace-nowrap text-[11px] leading-tight text-default-400',
            className
        )}
    >
        <FontAwesomeIcon icon={faCircleNotch} spin className='text-warning' />
        <span className='ml-1.5'>Waiting for server…</span>
    </div>
);

// Its own row above the prompt, growing in so the prompt slides down rather than jumps
export const WaitingRow = ({ waiting, className }) => (
    <AnimatePresence initial={false}>
        {waiting && (
            <motion.div
                key='waiting'
                className='overflow-hidden'
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={ease}
            >
                <WaitingChip className={classNames('h-7 pb-1', className)} />
            </motion.div>
        )}
    </AnimatePresence>
);

export default WaitingChip;
