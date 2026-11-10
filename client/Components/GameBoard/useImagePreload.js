import { useEffect } from 'react';
import { preloadCards } from '../../imageCache';

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

export const useImagePreload = (players) => {
    useEffect(() => {
        preloadCards(alwaysPreload);
    }, []);

    useEffect(() => {
        preloadCards(collectPlayerCodes(players));
    }, [players]);
};
