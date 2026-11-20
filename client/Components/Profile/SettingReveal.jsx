import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBrowserReducedMotion } from '../../motion';

// A setting shown only for some choices opens out and fades in, and closes up as it goes, so those below slide
// rather than jump. It is clipped only while it opens or closes.
const SettingReveal = ({ show, children }) => {
    const reducedMotion = useBrowserReducedMotion();

    return (
        <AnimatePresence initial={false}>
            {show && (
                <motion.div
                    key='reveal'
                    initial={{ height: 0, opacity: 0, y: -6, overflow: 'hidden' }}
                    animate={{
                        height: 'auto',
                        opacity: 1,
                        y: 0,
                        transitionEnd: { overflow: 'visible' }
                    }}
                    exit={{ height: 0, opacity: 0, y: -6, overflow: 'hidden' }}
                    transition={{ duration: reducedMotion ? 0 : 0.25, ease: 'easeInOut' }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SettingReveal;
