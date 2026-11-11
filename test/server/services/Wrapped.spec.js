import { buildWrapped, rankPlayers, topPercent } from '../../../server/services/WrappedService.js';
import {
    isValidUnsubscribeToken,
    renderWrappedEmail,
    unsubscribeToken
} from '../../../server/services/WrappedEmailService.js';
import { localHours } from '../../../client/Components/Wrapped/localHours.js';

function row(overrides = {}) {
    return {
        day: '2026-03-05',
        weekday: 4,
        hour: 19,
        quarter_hour: 77,
        seconds: 3600,
        game_type: 'casual',
        win_reason: 'power',
        won: true,
        faction: 'House Stark',
        agendas: ['Fealty'],
        stats: null,
        opponents: [{ userId: 2, won: false }],
        ...overrides
    };
}

describe('Wrapped', function () {
    describe('topPercent()', function () {
        it('should rank the best as the top 1%, and share ranks between ties', function () {
            const values = [10, 8, 8, 5];

            expect(topPercent(values, 10)).toBe(25);
            expect(topPercent(values, 8)).toBe(50);
            expect(topPercent(values, 5)).toBe(100);
            expect(
                topPercent(
                    new Array(200)
                        .fill(1)
                        .concat([2])
                        .sort((a, b) => b - a),
                    2
                )
            ).toBe(1);
        });
    });

    describe('rankPlayers()', function () {
        it('should rank each player on games, wins, win rate and dominant wins', function () {
            const ranks = rankPlayers([
                { userId: 1, games: 100, wins: 40, dominantWins: 10 },
                { userId: 2, games: 20, wins: 18, dominantWins: 2 }
            ]);

            expect(ranks.get(1)).toEqual({ games: 50, wins: 50, winRate: 100, dominantWins: 50 });
            expect(ranks.get(2)).toEqual({ games: 100, wins: 100, winRate: 50, dominantWins: 100 });
        });
    });

    describe('buildWrapped()', function () {
        it('should add games by month, start times and favourites to the summary', function () {
            const wrapped = buildWrapped({
                year: 2026,
                from: '2026-01-01',
                to: '2026-12-15',
                rows: [
                    row(),
                    row({ day: '2026-03-06', faction: 'House Lannister', agendas: [] }),
                    row({ day: '2026-11-01', quarter_hour: 0 })
                ],
                ranks: { games: 10, wins: 20, winRate: 30 },
                site: { games: 50, players: 4, topFaction: 'stark', detailedFrom: null }
            });

            expect(wrapped.byMonth[2]).toBe(2);
            expect(wrapped.byMonth[10]).toBe(1);
            expect(wrapped.startTimes[2][77]).toBe(2);
            expect(wrapped.startTimes[10][0]).toBe(1);
            expect(wrapped.favouriteFaction).toEqual({
                faction: 'stark',
                games: 2,
                wins: 2,
                dominantWins: 0
            });
            expect(wrapped.topPairing).toEqual({
                faction: 'stark',
                agendas: ['Fealty'],
                games: 2,
                wins: 2,
                dominantWins: 0
            });
            expect(wrapped.ranks.games).toBe(10);
        });
    });

    describe('localHours()', function () {
        it('should shift UTC start times into the timezone, using each month’s offset', function () {
            const startTimes = Array.from({ length: 12 }, () => new Array(96).fill(0));
            startTimes[0][76] = 1;
            startTimes[6][76] = 1;

            const hours = localHours(startTimes, 2026, (date) =>
                date.getUTCMonth() === 6 ? 60 : 0
            );

            expect(hours[19]).toBe(1);
            expect(hours[20]).toBe(1);
        });
    });

    describe('the email', function () {
        const wrapped = {
            year: 2026,
            games: 120,
            wins: 70,
            seconds: 100 * 3600,
            favouriteFaction: { faction: 'thenightswatch', games: 50, wins: 30 }
        };

        it('should link to the Wrapped page and to unsubscribe, escaping the username', function () {
            const email = renderWrappedEmail({
                appName: 'The Iron Throne',
                publicUrl: 'https://theironthrone.net',
                user: { id: 5, username: '<b>Jon</b>' },
                wrapped,
                token: 'abc'
            });

            expect(email.subject).toBe('Your 2026 page in the White Book is ready');
            expect(email.text).toContain('https://theironthrone.net/white-book/2026');
            expect(email.text).toContain("mostly as The Night's Watch");
            expect(email.html).toContain(
                'https://theironthrone.net/unsubscribe?id=5&amp;token=abc'
            );
            expect(email.html).toContain('&lt;b&gt;Jon&lt;/b&gt;');
            expect(email.html).not.toContain('<b>Jon</b>');
            expect(email.headers).toEqual([
                {
                    Name: 'List-Unsubscribe',
                    Value: '<https://theironthrone.net/api/unsubscribe?id=5&token=abc>'
                },
                { Name: 'List-Unsubscribe-Post', Value: 'List-Unsubscribe=One-Click' }
            ]);
        });

        it('should only accept the unsubscribe token for the same user and secret', function () {
            const token = unsubscribeToken('secret', 5);

            expect(isValidUnsubscribeToken('secret', 5, token)).toBe(true);
            expect(isValidUnsubscribeToken('secret', '5', token)).toBe(true);
            expect(isValidUnsubscribeToken('secret', 6, token)).toBe(false);
            expect(isValidUnsubscribeToken('other', 5, token)).toBe(false);
            expect(isValidUnsubscribeToken('secret', '5 OR 1=1', token)).toBe(false);
            expect(isValidUnsubscribeToken('secret', 5, undefined)).toBe(false);
            expect(isValidUnsubscribeToken(undefined, 5, token)).toBe(false);
        });
    });
});
