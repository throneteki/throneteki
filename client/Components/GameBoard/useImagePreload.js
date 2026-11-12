import { useEffect } from 'react';
import { background, preloadCards } from '../../imageCache';

const pileKeys = [
    'hand',
    'shadows',
    'cardsInPlay',
    'plotDeck',
    'plotDiscard',
    'drawDeck',
    'discardPile',
    'deadPile',
    'outOfGamePile'
];
const cardKeys = ['activePlot', 'selectedPlot', 'faction', 'title'];
const alwaysPreload = ['cardback', 'cardback_shadow'];

const collectCodes = (card, codes) => {
    if (!card || typeof card !== 'object') {
        return;
    }
    if (typeof card.code === 'string' && card.code) {
        codes.add(card.code);
    }
    [card.attachments, card.dupes, card.childCards].forEach((cards) =>
        cards?.forEach((child) => collectCodes(child, codes))
    );
};

export const collectPlayerCodes = (players) => {
    const codes = new Set();
    Object.values(players || {}).forEach((player) => {
        pileKeys.forEach((key) =>
            player.cardPiles?.[key]?.forEach((card) => collectCodes(card, codes))
        );
        cardKeys.forEach((key) => collectCodes(player[key], codes));
        player.agendas?.forEach((card) => collectCodes(card, codes));
    });

    return codes;
};

// What is on the table or on top of a pile is shown at once, so it is loaded first
const shownNow = ['hand', 'shadows', 'cardsInPlay'];
const topOfPile = ['plotDiscard', 'discardPile', 'deadPile', 'outOfGamePile'];

export const collectShownCodes = (players) => {
    const codes = new Set();
    Object.values(players || {}).forEach((player) => {
        shownNow.forEach((key) =>
            player.cardPiles?.[key]?.forEach((card) => collectCodes(card, codes))
        );
        topOfPile.forEach((key) =>
            player.cardPiles?.[key]?.slice(0, 2).forEach((card) => collectCodes(card, codes))
        );
        cardKeys.forEach((key) => collectCodes(player[key], codes));
        player.agendas?.forEach((card) => collectCodes(card, codes));
    });

    return codes;
};

const whenIdle = (task) => {
    if (typeof requestIdleCallback === 'function') {
        const id = requestIdleCallback(task, { timeout: 3000 });
        return () => cancelIdleCallback(id);
    }

    const id = setTimeout(task, 500);
    return () => clearTimeout(id);
};

export const useImagePreload = (players) => {
    useEffect(() => {
        preloadCards(alwaysPreload);
    }, []);

    useEffect(() => {
        const shown = collectShownCodes(players);
        preloadCards(shown);

        // Everything else is only loaded while nothing else is, and a few at a time
        return whenIdle(() => {
            const rest = [...collectPlayerCodes(players)].filter((code) => !shown.has(code));
            preloadCards(rest, background);
        });
    }, [players]);
};
