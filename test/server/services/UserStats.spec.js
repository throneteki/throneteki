import {
    factionCode,
    monthRange,
    nameSummary,
    summarise
} from '../../../server/services/UserStatsService.js';

function row(overrides = {}) {
    return {
        day: '2026-10-05',
        weekday: 1,
        hour: 19,
        quarter_hour: 76,
        seconds: 3600,
        game_type: 'competitive',
        win_reason: 'power',
        won: true,
        faction: 'House Stark',
        agendas: ['Fealty'],
        power: 15,
        stats: null,
        deck_id: null,
        opponents: [{ userId: 2, won: false }],
        ...overrides
    };
}

describe('UserStatsService', function () {
    describe('factionCode()', function () {
        it('should match the client faction values', function () {
            expect(factionCode('House Stark')).toBe('stark');
            expect(factionCode("The Night's Watch")).toBe('thenightswatch');
            expect(factionCode('stark')).toBe('stark');
            expect(factionCode(null)).toBe('unknown');
        });
    });

    describe('monthRange()', function () {
        it('should return the month and the next as UTC dates', function () {
            expect(monthRange('2026-10')).toEqual({ from: '2026-10-01', to: '2026-11-01' });
            expect(monthRange('2026-12')).toEqual({ from: '2026-12-01', to: '2027-01-01' });
        });

        it('should reject anything that is not a month', function () {
            expect(monthRange('2026-13')).toBeNull();
            expect(monthRange('2026-1')).toBeNull();
            expect(monthRange(undefined)).toBeNull();
        });
    });

    describe('summarise()', function () {
        it('should count the record, win reasons and streaks', function () {
            const summary = summarise([
                row(),
                row({ win_reason: 'concede' }),
                row({ won: false, win_reason: 'power' }),
                row(),
                row(),
                row({ win_reason: 'remaining' })
            ]);

            expect(summary.games).toBe(6);
            expect(summary.wins).toBe(5);
            expect(summary.losses).toBe(1);
            expect(summary.powerWins).toBe(3);
            expect(summary.winReasons).toEqual({ power: 3, concede: 1, remaining: 1, time: 0 });
            expect(summary.lossReasons.power).toBe(1);
            expect(summary.longestWinStreak).toBe(3);
        });

        it('should cap the time a single game counts for at three hours', function () {
            const summary = summarise([row({ seconds: 10 * 60 * 60 }), row({ seconds: -5 })]);

            expect(summary.seconds).toBe(3 * 60 * 60);
        });

        it('should count games by UTC day, weekday and hour', function () {
            const summary = summarise([row(), row({ day: '2026-10-11', weekday: 7, hour: 0 })]);

            expect(summary.byDay).toEqual({ '2026-10-05': 1, '2026-10-11': 1 });
            expect(summary.byWeekday).toEqual([1, 0, 0, 0, 0, 0, 1]);
            expect(summary.byHour[19]).toBe(1);
            expect(summary.byHour[0]).toBe(1);
        });

        it('should group games by faction and by faction and agendas', function () {
            const summary = summarise([
                row(),
                row({ won: false }),
                row({ agendas: ['The Rains of Castamere'] }),
                row({ faction: 'House Lannister', agendas: [] })
            ]);

            expect(summary.factions).toEqual([
                { faction: 'stark', games: 3, wins: 2, dominantWins: 2 },
                { faction: 'lannister', games: 1, wins: 1, dominantWins: 1 }
            ]);
            expect(summary.pairings[0]).toEqual({
                faction: 'stark',
                agendas: ['Fealty'],
                games: 2,
                wins: 1,
                dominantWins: 1
            });
            expect(summary.pairingCount).toBe(3);
        });

        it('should group games by deck when the deck is known', function () {
            const summary = summarise([
                row({ deck_id: 7 }),
                row({ deck_id: 7, won: false }),
                row()
            ]);

            expect(summary.decks).toEqual([
                { deckId: 7, faction: 'stark', games: 2, wins: 1, dominantWins: 1 }
            ]);
            expect(summary.deckCount).toBe(1);
        });

        it('should count melee games and who beat the player in them', function () {
            const summary = summarise([
                row({
                    won: false,
                    opponents: [
                        { userId: 2, won: true },
                        { userId: 3, won: false }
                    ]
                })
            ]);

            expect(summary.meleeGames).toBe(1);
            expect(summary.opponents).toEqual([
                { id: 2, lossesTo: 1, games: 1, wins: 0, dominantWins: 0 },
                { id: 3, lossesTo: 0, games: 1, wins: 0, dominantWins: 0 }
            ]);
        });

        it('should only find the fastest win among power wins with a round count', function () {
            const summary = summarise([
                row({ stats: { rounds: 7 } }),
                row({ win_reason: 'concede', stats: { rounds: 2 } }),
                row({ day: '2026-10-09', stats: { rounds: 5 } }),
                row()
            ]);

            expect(summary.fastestWin).toEqual({
                rounds: 5,
                day: '2026-10-09',
                faction: 'stark',
                opponentId: 2
            });
        });

        it('should not name an opponent for a fastest win in melee', function () {
            const summary = summarise([
                row({
                    stats: { rounds: 4 },
                    opponents: [
                        { userId: 2, won: false },
                        { userId: 3, won: false }
                    ]
                })
            ]);

            expect(summary.fastestWin.opponentId).toBeNull();
        });

        it('should add up in-game stats, leaving out games that used manual actions', function () {
            const stats = {
                rounds: 6,
                powerGained: 10,
                goldGained: 30,
                challengesWon: { military: 2, intrigue: 1, power: 3 },
                cards: {
                    '01001': { revealed: 2 },
                    '01028': { marshalled: 1, attacked: 4, defended: 1 },
                    '01042': { played: 2 }
                }
            };

            const summary = summarise([
                row({ stats }),
                row({ stats }),
                row({ stats: { ...stats, manualActions: [{ command: 'power' }] } }),
                row()
            ]);

            expect(summary.detailed.games).toBe(2);
            expect(summary.detailed.powerGained).toBe(20);
            expect(summary.detailed.rounds).toBe(12);
            expect(summary.detailed.challengesWon).toEqual({ military: 4, intrigue: 2, power: 6 });
            expect(summary.detailed.mvp.code).toBe('01028');
            expect(summary.detailed.favouritePlot).toEqual(
                jasmine.objectContaining({ code: '01001', revealed: 4 })
            );
            expect(summary.detailed.cards.map((card) => card.code)).toEqual(['01042', '01028']);
        });

        it('should have no in-game stats when no game recorded them', function () {
            expect(summarise([row()]).detailed).toBeNull();
        });
    });

    describe('nameSummary()', function () {
        it('should name opponents and pick the rival and nemesis, leaving out disabled accounts', function () {
            const summary = summarise([
                row({ opponents: [{ userId: 2, won: false }] }),
                row({ opponents: [{ userId: 2, won: false }] }),
                row({ won: false, opponents: [{ userId: 3, won: true }] }),
                row({ won: false, opponents: [{ userId: 4, won: true }] }),
                row({ won: false, opponents: [{ userId: 4, won: true }] }),
                row({ stats: { rounds: 4 }, opponents: [{ userId: 4, won: false }] })
            ]);

            const named = nameSummary(
                summary,
                new Map([
                    [2, { name: 'Ned', disabled: false }],
                    [3, { name: 'Cersei', disabled: false }],
                    [4, { name: 'Banned', disabled: true }]
                ])
            );

            expect(named.opponents.map((opponent) => opponent.name)).toEqual(['Ned', 'Cersei']);
            expect(named.opponentCount).toBe(2);
            expect(named.rival.name).toBe('Ned');
            expect(named.nemesis.name).toBe('Cersei');
            expect(named.fastestWin.opponent).toBeNull();
            expect(JSON.stringify(named)).not.toContain('Banned');
        });

        it('should name decks as they are now, with no name for deleted decks', function () {
            const summary = summarise([row({ deck_id: 7 }), row({ deck_id: 8 })]);

            const named = nameSummary(summary, new Map(), new Map([[7, 'Renamed']]));

            expect(named.decks.map((deck) => [deck.deckId, deck.name])).toEqual([
                [7, 'Renamed'],
                [8, null]
            ]);
        });
    });
});
