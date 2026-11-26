import { createContext, useContext } from 'react';

// Set by the adaptive board, for shared parts that draw themselves differently on it (compact counters, zone names
// behind areas, outlines that match the cards). False everywhere else, so the classic board is unchanged.
export const AdaptiveBoardContext = createContext(false);

export const useAdaptiveBoard = () => useContext(AdaptiveBoardContext);
