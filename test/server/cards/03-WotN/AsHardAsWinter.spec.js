describe('As Hard as Winter', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Maester Luwin'],
                hand: ['As Hard as Winter', 'Winterfell Steward', 'Robb Stark (Core)'],
                usedPlots: ['The Winds of Winter']
            },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.maesterLuwin);
        this.player1.triggerAbility('As Hard as Winter');
    });

    it('puts a stark character with equal or lower printed cost into play from your hand', function () {
        expect(this.player1).not.toAllowSelect(this.robbStark);
        this.player1.clickCard(this.winterfellSteward);

        expect(this.winterfellSteward.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
