describe('In the Name of Your King!', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: ['Tumblestone Knight'], hand: ['In the Name of Your King!'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.challenge = this.game.currentChallenge;
        this.player2.clickPrompt('Pass');
        this.player1.clickCard(this.inTheNameOfYourKing);
    });

    it('kneels your faction card to end the military challenge with no winner or loser', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.challenge.cancelled).toBe(true);
        expect(this.challenge.winner).toBeUndefined();
        expect(this.player2).isReadyToTakeAction();
    });

    it('stops you initiating military challenges for the rest of the phase', function () {
        this.player2.clickPrompt('Pass');
        this.player2.clickPrompt('Done');

        expect(this.player1).toHaveDisabledPromptButton('Military');
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('In the Name of Your King! with Dark Wings, Dark Words', function () {
    it('lets reactions to it resolve after it ends the challenge', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tumblestone Knight'] },
            player2: {
                faction: 'baratheon',
                agenda: 'Dark Wings, Dark Words',
                hand: ['In the Name of Your King!'],
                drawDeck: ['Hedge Knight'],
                gold: 1
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Pass');
        this.player2.clickCard(this.inTheNameOfYourKing);
        this.player2.triggerAbility(this.darkWingsDarkWords);

        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.game.currentChallenge).toBeFalsy();
        expect(this.player1).isReadyToTakeAction();
    });
});
