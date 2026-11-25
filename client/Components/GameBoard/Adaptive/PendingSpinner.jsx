import React from 'react';
import { Spinner } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { motionSettingOff } from '../../../flip';

// A prompt button pressed and not yet answered, at its right to mirror the shortcut at its left
const PendingSpinner = ({ pending }) => (
    <AnimatePresence initial={false}>
        {pending && (
            <motion.span
                key='pending'
                className='pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: motionSettingOff() ? 0 : 0.18 }}
            >
                <Spinner
                    size='sm'
                    aria-label='Sent'
                    classNames={{
                        wrapper: 'h-3.5 w-3.5',
                        circle1: 'border-3',
                        circle2: 'border-3'
                    }}
                />
            </motion.span>
        )}
    </AnimatePresence>
);

export default PendingSpinner;
