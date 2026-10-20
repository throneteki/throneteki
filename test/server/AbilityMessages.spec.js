import GameActions from '../../server/game/GameActions/index.js';

describe('ability messages', function () {
    function log(context) {
        return context.game
            .getPlainTextLog()
            .split('\n')
            .map((line) => line.replace(/^\S+ \S+ /, ''));
    }

    function linesAfter(context, marker) {
        const lines = log(context);
        return lines.slice(lines.lastIndexOf(marker) + 1);
    }

    describe('for an event that resolves', function () {
        beforeEach(function () {
            this.setupTest({
                player1: { hand: ['Wolf Dreams'], drawDeck: ['Grey Wind (Core)'] }
            });
            this.marker = log(this).at(-1);

            this.player1.clickCard(this.wolfDreams);
            this.player1.clickCard(this.greyWind);
        });

        it("logs the event's message before the messages from its effects", function () {
            const lines = linesAfter(this, this.marker);
            const played = lines.findIndex((line) =>
                line.startsWith('player1 plays Wolf Dreams and kneels their faction card')
            );
            const added = lines.findIndex((line) => line.includes('Grey Wind'));

            expect(played).toBeGreaterThanOrEqual(0);
            expect(added).toBeGreaterThan(played);
            expect(this.greyWind.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('for an event that is cancelled', function () {
        beforeEach(function () {
            this.setupTest({
                player1: { hand: ['Wolf Dreams'], drawDeck: ['Grey Wind (Core)'] },
                player2: { gold: 5, hand: ["The Hand's Judgment"] }
            });
            this.marker = log(this).at(-1);

            this.player1.clickCard(this.wolfDreams);
            this.player2.triggerAbility("The Hand's Judgment");
        });

        it('logs that the event was played, but not what it would have done', function () {
            const lines = linesAfter(this, this.marker);

            expect(lines).toContain('player1 plays Wolf Dreams');
            expect(lines.indexOf('player1 plays Wolf Dreams')).toBeLessThan(
                lines.findIndex((line) => line.includes("The Hand's Judgment"))
            );
            expect(lines.some((line) => line.includes('to search their deck'))).toBe(false);
            expect(this.greyWind.location).toBe('draw deck');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('for an action whose game action is saved', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Bastard in Hiding'] },
                player2: { inPlay: [{ card: 'Septa Mordane', dupes: 1 }, 'House Dayne Knight'] }
            });

            this.bastardInHiding.action({
                title: 'Kill a character',
                target: { cardCondition: (card) => card.getType() === 'character' },
                message: '{player} uses {source} to kill {target}',
                gameAction: GameActions.kill((context) => ({ card: context.target }))
            });
            this.marker = log(this).at(-1);
        });

        it('logs the full message when the effect happens', function () {
            this.player1.clickMenu(this.bastardInHiding, 'Kill a character');
            this.player1.clickCard(this.houseDayneKnight);

            expect(this.houseDayneKnight.location).toBe('dead pile');
            expect(linesAfter(this, this.marker)).toContain(
                'player1 uses Bastard in Hiding to kill House Dayne Knight'
            );
        });

        it('logs that the action was used, not the kill, when the target is saved', function () {
            this.player1.clickMenu(this.bastardInHiding, 'Kill a character');
            this.player1.clickCard(this.septaMordane);

            const lines = linesAfter(this, this.marker);
            expect(this.septaMordane.location).toBe('play area');
            expect(lines).toContain('player1 uses Bastard in Hiding');
            expect(lines.some((line) => line.includes('to kill Septa Mordane'))).toBe(false);
        });
    });
});
