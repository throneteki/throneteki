describe('We Stand Together', function () {
    it('stands an attacking House Frey character after you win a challenge', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Black Walder'], hand: ['We Stand Together'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.blackWalder);
        this.player1.triggerAbility('We Stand Together');
        this.player1.clickCard(this.blackWalder);
        expect(this.blackWalder.kneeled).toBe(false);
    });

    it('stands each attacking House Frey character in your third challenge', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Black Walder', 'Genna Frey', 'Hedge Knight', 'Robb Stark (Core)'],
                hand: ['We Stand Together']
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.unopposedChallenge(this.player1, 'Power', this.robbStark);
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.blackWalder);
        this.player1.clickCard(this.gennaFrey);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility('We Stand Together');
        this.player1.clickCard(this.blackWalder);
        expect(this.blackWalder.kneeled).toBe(false);
        expect(this.gennaFrey.kneeled).toBe(false);
    });
});
