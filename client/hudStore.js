import { useSyncExternalStore } from 'react';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { normalizeHud } from './hud';

let override = null;
const listeners = new Set();

const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const hudStore = {
    set(next) {
        override = next;
        listeners.forEach((listener) => listener());
    },
    reset() {
        this.set(null);
    }
};

// A change made in this game first, then what was saved for this game (kept by the server, so it survives a
// refresh), then the profile
const gameHudOf = (state) => {
    const game = state.lobby.currentGame;
    const name = state.auth.user?.username;
    if (!game || !name) {
        return undefined;
    }
    return (
        game.players?.[name]?.hud ??
        game.spectators?.find((spectator) => spectator.name === name)?.hud
    );
};

export const useHud = () => {
    const settings = useSelector((state) => state.auth.user?.settings);
    const gameHud = useSelector(gameHudOf);
    const current = useSyncExternalStore(subscribe, () => override);
    const saved = useMemo(
        () => normalizeHud(gameHud ? { ...settings, hud: gameHud } : settings),
        [settings, gameHud]
    );

    return current || saved;
};
