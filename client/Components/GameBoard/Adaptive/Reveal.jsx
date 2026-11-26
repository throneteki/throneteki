import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const revealTime = 0.3;

// Something that comes and goes in a row (a pile shown only at times) opens out and closes up, so whatever is
// beside it slides over rather than jumping. It is clipped only while it opens or closes.
const Reveal = ({ show, className, children }) => (
    <AnimatePresence initial={false}>
        {show && (
            <motion.div
                key='reveal'
                className={className}
                initial={{ width: 0, opacity: 0, overflow: 'hidden' }}
                animate={{
                    width: 'auto',
                    opacity: 1,
                    transitionEnd: { overflow: 'visible' }
                }}
                exit={{ width: 0, opacity: 0, overflow: 'hidden' }}
                transition={{ duration: revealTime, ease: 'easeInOut' }}
            >
                {children}
            </motion.div>
        )}
    </AnimatePresence>
);

export default Reveal;
