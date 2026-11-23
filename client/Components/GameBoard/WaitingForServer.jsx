import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { useWaitingForServer } from './serverWait';

const WaitingForServer = () => {
    const waiting = useWaitingForServer();

    return (
        <div className='pointer-events-none absolute inset-0 z-[300] flex items-center justify-center'>
            <AnimatePresence>
                {waiting && (
                    <motion.div
                        role='status'
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className='flex items-center gap-2 rounded-full border border-warning/60 bg-black/85 px-4 py-1.5 text-sm font-semibold text-white shadow-lg'
                    >
                        <FontAwesomeIcon icon={faCircleNotch} spin className='text-warning' />
                        Waiting for server…
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WaitingForServer;
