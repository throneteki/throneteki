import DeckValidator from '../../deck-helper/DeckValidator.js';
import DeckWrapper from '../../deck-helper/DeckWrapper.js';
import AgendaRules from '../../deck-helper/AgendaRules.js';
import { deckBuilder } from '../helpers/cards.js';

const DraftPacks = ['ToJ', 'VDS'];
const Plots = [
    'A Clash of Kings (Core)',
    'A Feast for Crows (Core)',
    'A Game of Thrones (Core)',
    'A Noble Cause (Core)',
    'A Storm of Swords (Core)',
    'Taxation (Core)',
    'Confiscation (Core)'
];

const hasTrait = (trait) => (card) => (card.traits || []).includes(trait);
const isType = (type) => (card) => card.type === type;
const isFaction = (faction) => (card) => card.faction === faction;
const isLoyal = (card) => !!card.loyal;
const not = (predicate) => (card) => !predicate(card);
const all =
    (...predicates) =>
    (card) =>
        predicates.every((predicate) => predicate(card));
const printedText = (card) => (card.text || '').replace(/<[^>]+>/g, '');
const hasShadowKeyword = (card) => /^[^\n]*Shadow \((\d+|X)\)/.test(printedText(card));
const isLimited = (card) => /^Limited\./.test(printedText(card));

// Codes of cards with distinct titles, from the draft packs only when asked for.
function cards(predicate, count, { draft = false } = {}) {
    const names = new Set();
    const codes = [];
    for (const card of deckBuilder.cards) {
        if (DraftPacks.includes(card.packCode) !== draft || names.has(card.name)) {
            continue;
        }
        if (predicate(card)) {
            names.add(card.name);
            codes.push(card.code);
        }
    }
    if (codes.length < count) {
        throw new Error(`Only ${codes.length} cards match, the test needs ${count}`);
    }
    return codes.slice(0, count);
}

function card(predicate, options) {
    return cards(predicate, 1, options)[0];
}

function printingsOf(predicate) {
    const byName = new Map();
    for (const candidate of deckBuilder.cards) {
        if (!DraftPacks.includes(candidate.packCode) && predicate(candidate)) {
            byName.set(candidate.name, [...(byName.get(candidate.name) || []), candidate.code]);
        }
    }
    const printings = [...byName.values()].find((codes) => codes.length > 1);
    if (!printings) {
        throw new Error('No card with two printings matches');
    }
    return printings.slice(0, 2);
}

function copies(count, code) {
    return Array(count).fill(code);
}

function threeOfEach(codes) {
    return codes.flatMap((code) => copies(3, code));
}

function buildDeck({ faction = 'stark', agendas = [], plots = Plots, draw = [] }) {
    return deckBuilder.buildDeck(faction, [...agendas, ...plots, ...draw]);
}

function errors(options) {
    return new DeckValidator([], options.format ?? 'joust').validateDeck(buildDeck(options))
        .extendedStatus;
}

function allows(options, code) {
    const format = options.format ?? 'joust';
    const rules = new DeckValidator([], format).getRules(
        new DeckWrapper(buildDeck({ ...options, plots: [] })),
        format
    );
    const candidate = deckBuilder.getCard(code);
    return rules.mayInclude(candidate) && !rules.cannotInclude(candidate);
}

describe('agenda deck rules', function () {
    describe('banners', function () {
        const Banners = {
            '01198': ['baratheon', 'Baratheon'],
            '01199': ['greyjoy', 'Greyjoy'],
            '01200': ['lannister', 'Lannister'],
            '01201': ['martell', 'Martell'],
            '01202': ['thenightswatch', "Night's Watch"],
            '01203': ['stark', 'Stark'],
            '01204': ['targaryen', 'Targaryen'],
            '01205': ['tyrell', 'Tyrell']
        };

        for (const [code, [faction, factionName]] of Object.entries(Banners)) {
            describe(deckBuilder.getCard(code).name, function () {
                const options = {
                    faction: faction === 'stark' ? 'lannister' : 'stark',
                    agendas: [code]
                };
                const bannerCards = cards(
                    all(isFaction(faction), not(isLoyal), not(isType('plot'))),
                    4
                );

                it(`lets the deck include non-loyal ${factionName} cards`, function () {
                    expect(allows(options, bannerCards[0])).toBe(true);
                });

                it(`does not let the deck include loyal ${factionName} cards`, function () {
                    const loyal = card(all(isFaction(faction), isLoyal, not(isType('plot'))));

                    expect(allows(options, loyal)).toBe(false);
                });

                it(`requires 12 ${factionName} cards`, function () {
                    const message = `Must contain 12 or more ${factionName} cards`;
                    const twelve = threeOfEach(bannerCards);

                    expect(errors({ ...options, draw: twelve })).not.toContain(message);
                    expect(errors({ ...options, draw: twelve.slice(1) })).toContain(message);
                });
            });
        }
    });

    describe('Fealty', function () {
        const neutral = threeOfEach(
            cards(
                all(isFaction('neutral'), isType('character'), (c) => c.deckLimit === 3),
                6
            )
        );
        const message = 'You cannot include more than 15 neutral cards in a deck with Fealty';

        it('allows 15 neutral cards in the draw deck, but not 16, and ignores plots', function () {
            expect(errors({ agendas: ['01027'], draw: neutral.slice(0, 15) })).not.toContain(
                message
            );
            expect(errors({ agendas: ['01027'], draw: neutral.slice(0, 16) })).toContain(message);
        });
    });

    describe('Kings of Summer and Kings of Winter', function () {
        const winter = card(all(isType('plot'), hasTrait('Winter')));
        const summer = card(all(isType('plot'), hasTrait('Summer')));

        it('Kings of Summer cannot include Winter plots', function () {
            expect(allows({ agendas: ['04037'] }, winter)).toBe(false);
            expect(allows({ agendas: ['04037'] }, summer)).toBe(true);
            expect(errors({ agendas: ['04037'], plots: [...Plots.slice(1), winter] })).toContain(
                'Kings of Summer cannot include Winter plot cards'
            );
        });

        it('Kings of Winter cannot include Summer plots', function () {
            expect(allows({ agendas: ['04038'] }, summer)).toBe(false);
            expect(allows({ agendas: ['04038'] }, winter)).toBe(true);
            expect(errors({ agendas: ['04038'], plots: [...Plots.slice(1), summer] })).toContain(
                'Kings of Winter cannot include Summer plot cards'
            );
        });
    });

    describe('The Rains of Castamere', function () {
        const schemes = cards(all(isType('plot'), hasTrait('Scheme')), 5);
        const others = cards(all(isType('plot'), not(hasTrait('Scheme'))), 7);
        const message = 'Rains of Castamere must contain exactly 5 different Scheme plots';

        it('accepts 12 plots including exactly 5 different Schemes', function () {
            const result = errors({ agendas: ['05045'], plots: [...schemes, ...others] });

            expect(result).not.toContain(message);
            expect(result).not.toContain('Too few plot cards');
        });

        it('rejects 4 Schemes, or 5 that are not all different', function () {
            const fourSchemes = [...schemes.slice(0, 4), ...others, others[0]];
            const repeatedScheme = [...schemes.slice(0, 4), schemes[0], ...others];

            expect(errors({ agendas: ['05045'], plots: fourSchemes })).toContain(message);
            expect(errors({ agendas: ['05045'], plots: repeatedScheme })).toContain(message);
        });

        it('rejects 7 plots', function () {
            expect(errors({ agendas: ['05045'] })).toContain('Too few plot cards');
        });
    });

    describe('Alliance', function () {
        const draw = threeOfEach(
            cards(
                all(isFaction('stark'), (c) => c.deckLimit === 3),
                25
            )
        );

        it('requires 75 draw cards', function () {
            expect(errors({ agendas: ['06018'], draw: draw.slice(0, 74) })).toContain(
                'Too few draw cards'
            );
            expect(errors({ agendas: ['06018'], draw })).not.toContain('Too few draw cards');
        });

        it('allows 2 banners but not 3', function () {
            const message = 'Alliance cannot have more than 2 Banner agendas';

            expect(errors({ agendas: ['06018', '01198', '01199'] })).not.toContain(message);
            expect(errors({ agendas: ['06018', '01198', '01199', '01200'] })).toContain(message);
        });
    });

    describe('The Brotherhood Without Banners', function () {
        it('cannot include loyal characters', function () {
            const loyalCharacter = card(all(isFaction('stark'), isLoyal, isType('character')));
            const loyalLocation = card(all(isFaction('stark'), isLoyal, isType('location')));

            expect(allows({ agendas: ['06119'] }, loyalCharacter)).toBe(false);
            expect(allows({ agendas: ['06119'] }, loyalLocation)).toBe(true);
        });
    });

    describe('trait agendas that allow characters from any faction', function () {
        const Agendas = [
            { code: '09045', trait: 'Maester', required: 12 },
            { code: '13099', trait: 'Kingsguard', required: 7, distinct: true },
            { code: '20051', trait: 'Fool' },
            { code: '26040', trait: 'Small Council', required: 7, distinct: true },
            { code: '27040', trait: 'Guard', required: 12 }
        ];

        for (const { code, trait, required, distinct } of Agendas) {
            describe(deckBuilder.getCard(code).name, function () {
                const isTraitCharacter = all(isType('character'), hasTrait(trait));
                const outOfFaction = all(
                    isTraitCharacter,
                    not(isFaction('stark')),
                    not(isFaction('neutral'))
                );

                it(`lets the deck include non-loyal ${trait} characters from any faction`, function () {
                    const character = card(all(outOfFaction, not(isLoyal)));

                    expect(allows({ agendas: [code] }, character)).toBe(true);
                });

                it(`does not let the deck include loyal ${trait} characters from another faction`, function () {
                    for (const loyal of cards(all(outOfFaction, isLoyal), 0)) {
                        expect(allows({ agendas: [code] }, loyal)).toBe(false);
                    }
                });

                it('does not let the deck include other cards from another faction', function () {
                    const other = card(
                        all(isFaction('lannister'), not(isLoyal), not(hasTrait(trait)))
                    );

                    expect(allows({ agendas: [code] }, other)).toBe(false);
                });

                if (!required) {
                    return;
                }

                const message = `Must contain ${required} or more ${distinct ? 'different ' : ''}${trait} characters`;

                it(`requires ${required} ${distinct ? 'different ' : ''}${trait} characters`, function () {
                    const titles = cards(isTraitCharacter, distinct ? required : 4);
                    const enough = distinct ? titles : threeOfEach(titles);

                    expect(errors({ agendas: [code], draw: enough })).not.toContain(message);
                    expect(errors({ agendas: [code], draw: enough.slice(1) })).toContain(message);
                });

                if (distinct) {
                    it('counts each title once', function () {
                        const titles = cards(isTraitCharacter, required - 1);
                        const threeCopies = threeOfEach(titles);
                        const reprinted = printingsOf(isTraitCharacter);
                        const others = cards(
                            all(
                                isTraitCharacter,
                                (c) => c.name !== deckBuilder.getCard(reprinted[0]).name
                            ),
                            required - 2
                        );

                        expect(errors({ agendas: [code], draw: threeCopies })).toContain(message);
                        expect(
                            errors({ agendas: [code], draw: [...others, ...reprinted] })
                        ).toContain(message);
                    });
                }
            });
        }
    });

    describe('The Wars To Come', function () {
        for (const code of ['10045', '17151']) {
            it(`(${code}) requires 10 plots and allows 2 doubled plots but not 3`, function () {
                const plots = cards(isType('plot'), 8);
                const twoDoubled = [...plots, plots[0], plots[1]];
                const threeDoubled = [...plots.slice(0, 7), plots[0], plots[1], plots[2]];
                const twoDoubledErrors = errors({ agendas: [code], plots: twoDoubled });

                expect(twoDoubledErrors).not.toContain('Too few plot cards');
                expect(twoDoubledErrors).not.toContain(
                    'Maximum allowed number of doubled plots: 2'
                );
                expect(errors({ agendas: [code], plots: threeDoubled })).toContain(
                    'Maximum allowed number of doubled plots: 2'
                );
                expect(errors({ agendas: [code] })).toContain('Too few plot cards');
            });
        }
    });

    describe('The Free Folk', function () {
        it('can only include neutral cards', function () {
            expect(allows({ agendas: ['11079'] }, card(isFaction('stark')))).toBe(false);
            expect(allows({ agendas: ['11079'] }, card(isFaction('neutral')))).toBe(true);
        });

        it('(redesign) can also include non-loyal Wildling characters from any faction', function () {
            const wildling = card(
                all(
                    isType('character'),
                    hasTrait('Wildling'),
                    not(isLoyal),
                    not(isFaction('neutral'))
                )
            );
            const otherStark = card(all(isFaction('stark'), not(hasTrait('Wildling'))));
            const message = 'Must only contain neutral cards or Non-loyal Wildling characters';

            expect(allows({ agendas: ['17150'] }, wildling)).toBe(true);
            expect(errors({ agendas: ['17150'], draw: [wildling] })).not.toContain(message);
            expect(errors({ agendas: ['17150'], draw: [otherStark] })).toContain(message);
        });
    });

    describe('Kingdom of Shadows', function () {
        for (const code of ['13079', '17148']) {
            it(`(${code}) lets the deck include non-loyal characters with shadow from any faction`, function () {
                const outOfFaction = all(isType('character'), not(isLoyal), isFaction('lannister'));

                expect(allows({ agendas: [code] }, card(all(outOfFaction, hasShadowKeyword)))).toBe(
                    true
                );
                expect(
                    allows({ agendas: [code] }, card(all(outOfFaction, not(hasShadowKeyword))))
                ).toBe(false);
            });
        }
    });

    describe('copy limits', function () {
        const attachment = card(all(isType('attachment'), isFaction('neutral')));
        const event = card(all(isType('event'), isFaction('neutral')));

        it('Valyrian Steel requires 75 cards and 1 copy of each attachment', function () {
            const message = 'Cannot include more than 1 copy of each attachment (by title)';

            expect(errors({ agendas: ['13118'] })).toContain('Too few draw cards');
            expect(errors({ agendas: ['13118'], draw: [attachment] })).not.toContain(message);
            expect(errors({ agendas: ['13118'], draw: copies(2, attachment) })).toContain(message);
        });

        it('Valyrian Steel (redesign) counts two printings of the same title as copies', function () {
            const message = 'Cannot include more than 1 copy of each attachment';

            expect(errors({ agendas: ['17152'], draw: [attachment] })).not.toContain(message);
            expect(errors({ agendas: ['17152'], draw: copies(2, attachment) })).toContain(message);
            expect(
                errors({ agendas: ['17152'], draw: printingsOf(isType('attachment')) })
            ).toContain(message);
        });

        it('Dark Wings, Dark Words requires 75 cards and 1 copy of each event', function () {
            const message = 'Cannot include more than 1 copy of each event (by title)';

            expect(errors({ agendas: ['16028'] })).toContain('Too few draw cards');
            expect(errors({ agendas: ['16028'], draw: [event] })).not.toContain(message);
            expect(errors({ agendas: ['16028'], draw: copies(2, event) })).toContain(message);
        });

        it('Trading With Braavos allows 1 copy of each non-limited location', function () {
            const message = 'Cannot include more than 1 copy of each non-limited location';
            const location = card(all(isType('location'), isFaction('neutral'), not(isLimited)));
            const limited = card(all(isType('location'), isFaction('neutral'), isLimited));
            const reprinted = printingsOf(all(isType('location'), not(isLimited)));

            expect(errors({ agendas: ['26080'], draw: [location] })).not.toContain(message);
            expect(errors({ agendas: ['26080'], draw: copies(2, location) })).toContain(message);
            expect(errors({ agendas: ['26080'], draw: reprinted })).toContain(message);
            expect(errors({ agendas: ['26080'], draw: copies(3, limited) })).not.toContain(message);
        });

        it('Trading With Braavos lets the deck include non-loyal Warship locations from any faction', function () {
            const warship = card(
                all(isType('location'), hasTrait('Warship'), not(isLoyal), not(isFaction('stark')))
            );

            expect(allows({ agendas: ['26080'] }, warship)).toBe(true);
        });
    });

    describe('The Long Voyage', function () {
        it('requires 100 draw cards', function () {
            const draw = threeOfEach(
                cards(
                    all(
                        (c) => ['stark', 'neutral'].includes(c.faction),
                        (c) => c.deckLimit === 3,
                        not(isType('plot')),
                        not(isType('agenda'))
                    ),
                    34
                )
            ).slice(0, 100);

            expect(errors({ agendas: ['16030'], draw: draw.slice(0, 99) })).toContain(
                'Too few draw cards'
            );
            expect(errors({ agendas: ['16030'], draw })).not.toContain('Too few draw cards');
        });
    });

    describe('card type restrictions', function () {
        it('Sea of Blood cannot include neutral events', function () {
            const neutralEvent = card(all(isType('event'), isFaction('neutral')));
            const starkEvent = card(all(isType('event'), isFaction('stark')));

            expect(allows({ agendas: ['17149'] }, neutralEvent)).toBe(false);
            expect(allows({ agendas: ['17149'] }, starkEvent)).toBe(true);
        });

        it('The Many-Faced God cannot include Kingdom plots', function () {
            const kingdom = card(all(isType('plot'), hasTrait('Kingdom')));

            expect(allows({ agendas: ['20052'] }, kingdom)).toBe(false);
        });

        it('The Gift of Mercy cannot include Omen plots', function () {
            const omen = card(all(isType('plot'), hasTrait('Omen')));

            expect(allows({ agendas: ['25080'] }, omen)).toBe(false);
        });

        it('Battle of the Trident requires 10 Edict, Siege or War plots', function () {
            const isBattlePlot = (c) => ['Edict', 'Siege', 'War'].some((t) => hasTrait(t)(c));
            const battlePlots = cards(all(isType('plot'), isBattlePlot), 10);
            const other = card(all(isType('plot'), not(isBattlePlot)));
            const message =
                'Battle of the Trident must contain exactly 10 Edict, Siege or War plots';

            expect(errors({ agendas: ['21030'], plots: battlePlots })).not.toContain(message);
            expect(
                errors({ agendas: ['21030'], plots: [...battlePlots.slice(1), other] })
            ).toContain(message);
        });
    });

    describe('Banner of the Falcon', function () {
        it('requires 12 House Arryn cards', function () {
            const arryn = threeOfEach(cards(all(hasTrait('House Arryn'), not(isType('plot'))), 4));
            const message = 'Must contain 12 or more House Arryn cards';

            expect(errors({ agendas: ['23040'], draw: arryn })).not.toContain(message);
            expect(errors({ agendas: ['23040'], draw: arryn.slice(1) })).toContain(message);
        });
    });

    describe('Uniting the Realm', function () {
        const message = 'Cannot contain more than 3 different cards from any faction';
        const isLannisterCharacter = all(isFaction('lannister'), not(isLoyal), isType('character'));
        const lannister = cards(isLannisterCharacter, 4);

        it('lets the deck include non-loyal characters, locations and attachments from any faction', function () {
            const lannisterEvent = card(all(isFaction('lannister'), isType('event')));

            expect(allows({ agendas: ['25120'] }, lannister[0])).toBe(true);
            expect(allows({ agendas: ['25120'] }, lannisterEvent)).toBe(false);
        });

        it("allows 3 different titles from a faction but not 4, including the deck's own", function () {
            const stark = cards(all(isFaction('stark'), isType('character')), 4);

            expect(
                errors({ agendas: ['25120'], draw: threeOfEach(lannister.slice(0, 3)) })
            ).not.toContain(message);
            expect(errors({ agendas: ['25120'], draw: lannister })).toContain(message);
            expect(errors({ agendas: ['25120'], draw: stark })).toContain(message);
        });

        it('counts two printings of the same title once', function () {
            const reprinted = printingsOf(isLannisterCharacter);
            const others = cards(
                all(isLannisterCharacter, (c) => c.name !== deckBuilder.getCard(reprinted[0]).name),
                2
            );

            expect(errors({ agendas: ['25120'], draw: [...others, ...reprinted] })).not.toContain(
                message
            );
        });
    });

    describe('draft agendas', function () {
        const options = (agenda) => ({ format: 'draft', agendas: [agenda] });

        it('The Power of Wealth allows cards from one outside faction', function () {
            const message = 'Cannot include cards from more than 1 outside faction';
            const lannister = card(isFaction('lannister'), { draft: true });
            const greyjoy = card(isFaction('greyjoy'), { draft: true });

            expect(errors({ ...options('00001'), draw: [lannister] })).not.toContain(message);
            expect(errors({ ...options('00001'), draw: [lannister, greyjoy] })).toContain(message);
        });

        it('Protectors of the Realm allows Knight and Army characters from any faction', function () {
            const knight = card(
                all(isType('character'), hasTrait('Knight'), isFaction('lannister')),
                { draft: true }
            );

            expect(allows(options('00002'), knight)).toBe(true);
        });

        it('Treaty allows cards from two outside factions', function () {
            const message = 'Cannot include cards from more than 2 outside factions';
            const outside = ['lannister', 'greyjoy', 'martell'].map((faction) =>
                card(isFaction(faction), { draft: true })
            );

            expect(errors({ ...options('00003'), draw: outside.slice(0, 2) })).not.toContain(
                message
            );
            expect(errors({ ...options('00003'), draw: outside })).toContain(message);
        });

        it('Uniting the Seven Kingdoms allows draw cards from any faction', function () {
            expect(allows(options('00004'), card(isFaction('lannister'), { draft: true }))).toBe(
                true
            );
        });
    });

    it('covers every agenda with deck rules', function () {
        const covered = [
            ...['01198', '01199', '01200', '01201', '01202', '01203', '01204', '01205'],
            ...['01027', '04037', '04038', '05045', '06018', '06119', '09045', '10045'],
            ...['11079', '13079', '13099', '13118', '16028', '16030', '17148', '17149'],
            ...['17150', '17151', '17152', '20051', '20052', '21030', '23040', '25080'],
            ...['25120', '26040', '26080', '27040', '00001', '00002', '00003', '00004']
        ];

        expect(Object.keys(AgendaRules).sort()).toEqual(covered.sort());
    });
});
