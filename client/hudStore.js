import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { normalizeHud } from './hud';

// The board's settings, as saved in the profile
export const useHud = () => {
    const settings = useSelector((state) => state.auth.user?.settings);
    return useMemo(() => normalizeHud(settings), [settings]);
};
