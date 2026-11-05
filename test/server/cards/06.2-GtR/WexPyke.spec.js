describe('Wex Pyke', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Wex Pyke', gold: 2 }] },
            player2: { inPlay: ['Burned Men', 'Khal Drogo (Core)'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.wexPyke);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('stops characters with printed cost equal to his gold defending while he attacks', function () {
        expect(this.player2).not.toBeAbleToSelect(this.burnedMen);
        expect(this.player2).toBeAbleToSelect(this.khalDrogo);

        this.player2.clickPrompt('Done');
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Wex Pyke', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ['Wex Pyke'], gold: 1 } });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.wexPyke);
    });

    it('moves 1 gold from your gold pool to himself during the dominance phase', function () {
        expect(this.wexPyke.gold).toBe(1);
        expect(this.player1Object.gold).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });
});
