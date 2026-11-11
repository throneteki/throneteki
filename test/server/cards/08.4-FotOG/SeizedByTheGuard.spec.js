import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Seized by the Guard', function () {
    function setup(tokens) {
        this.setupTest({
            phase: 'plot',
            player1: {
                inPlay: [
                    {
                        card: 'Casterly Rock (Core)',
                        attachments: [{ card: 'Seized by the Guard', tokens }]
                    }
                ]
            }
        });
        [this.seized] = this.casterlyRock.attachments;
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    }

    it('discards 1 gold from itself when the marshaling phase begins', function () {
        setup.call(this, { [Tokens.gold]: 2 });
        this.player1.clickPrompt('Yes');
        expect(this.seized.tokens[Tokens.gold]).toBe(1);
        expect(this.seized.location).toBe('play area');
    });

    it('is sacrificed when the marshaling phase begins without gold', function () {
        setup.call(this, {});
        expect(this.seized.location).toBe('discard pile');
    });
});

describe('Seized by the Guard marshaled from under The Great Pyramid', function () {
    it('can only be attached to a non-limited location', function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player1',
            player1: {
                faction: 'targaryen',
                inPlay: ['The Great Pyramid', 'The Iron Bank (TAK)', 'Hedge Knight'],
                hand: ['Seized by the Guard'],
                gold: 1
            },
            player2: { inPlay: ['House Dayne Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Intrigue', this.houseDayneKnight);
        this.player1.triggerAbility('The Great Pyramid');
        this.player2.clickPrompt('Done');
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.seizedByTheGuard);

        expect(this.player1).toBeAbleToSelect(this.theIronBank);
        expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);

        this.player1.clickCard(this.theIronBank);

        expect(this.seizedByTheGuard.parent).toBe(this.theIronBank);
        expect(this.seizedByTheGuard.facedown).toBe(false);
    });
});
