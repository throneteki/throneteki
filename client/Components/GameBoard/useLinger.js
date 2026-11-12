import { useEffect, useState } from 'react';

// True while the value is true, and for a while after it turns false
export const useLinger = (value, milliseconds) => {
    const [lingering, setLingering] = useState(value);

    useEffect(() => {
        if (value) {
            setLingering(true);
            return;
        }

        const timer = setTimeout(() => setLingering(false), milliseconds);
        return () => clearTimeout(timer);
    }, [value, milliseconds]);

    return value || lingering;
};
