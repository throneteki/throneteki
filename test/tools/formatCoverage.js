import {
    compileLegalityLists,
    setActiveLegalityLists
} from '../../deck-helper/compileLegalityLists.js';
import { needsImplementation } from '../../server/game/needsImplementation.js';

const deckCardTypes = new Set(['agenda', 'attachment', 'character', 'event', 'location', 'plot']);

export function formatCoverage({
    cards,
    packs,
    lists,
    implementations,
    verifiedCodes,
    now = new Date()
}) {
    const implemented = new Set(implementations.flatMap((implementation) => implementation.codes));
    const withSpecs = new Set(
        implementations
            .filter((implementation) => implementation.hasSpec)
            .flatMap((implementation) => implementation.codes)
    );
    const releasedPacks = new Set(
        packs
            .filter((pack) => pack.releaseDate && Date.parse(pack.releaseDate) <= now.getTime())
            .map((pack) => pack.code)
    );
    const legalities = setActiveLegalityLists(compileLegalityLists(lists), now);
    return legalities
        .filter((list) => list.active)
        .map((list) => {
            const banned = new Set(list.banned);
            const pool = [...cards.values()].filter(
                (card) =>
                    deckCardTypes.has(card.type) &&
                    releasedPacks.has(card.packCode) &&
                    (list.format === 'draft' || !['ToJ', 'VDS'].includes(card.packCode)) &&
                    !banned.has(card.code)
            );
            const noCode = (card) => !needsImplementation(card);
            return {
                id: list._id,
                name: list.name,
                format: list.format,
                variant: list.variant,
                date: list.date,
                total: pool.length,
                implemented: pool.filter((card) => implemented.has(card.code)).length,
                specs: pool.filter((card) => withSpecs.has(card.code)).length,
                verified: pool.filter((card) => verifiedCodes.has(card.code)).length,
                noCode: pool.filter(noCode).length,
                playable: pool.filter((card) => verifiedCodes.has(card.code) || noCode(card))
                    .length,
                missing: pool
                    .filter((card) => !verifiedCodes.has(card.code) && !noCode(card))
                    .map((card) => card.code)
                    .sort()
            };
        });
}
