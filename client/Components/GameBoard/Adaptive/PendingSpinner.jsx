import React from 'react';
import { Spinner } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';
import { motionSettingOff } from '../../../flip';

// A prompt button pressed and not yet answered, at its right to mirror the shortcut at its left, or small in its
// top right corner
const PendingSpinner = ({ pending, corner = false }) => (
    <AnimatePresence initial={false}>
        {pending && (
            <motion.span
                key='pending'
                className={classNames(
                    'pointer-events-none absolute flex',
                    corner ? 'right-0.5 top-0.5' : 'right-2 top-1/2 -translate-y-1/2'
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: motionSettingOff() ? 0 : 0.18 }}
            >
                <Spinner
                    size='sm'
                    color='current'
                    aria-label='Sent'
                    className={corner ? 'size-2.5' : 'size-3.5'}
                />
            </motion.span>
        )}
    </AnimatePresence>
);

export default PendingSpinner;
