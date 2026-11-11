describe('Weirwood Bow', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: [
                    { card: 'Steward at the Wall', attachments: ['Weirwood Bow'] },
                    'Tumblestone Knight'
                ]
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.weirwoodBow);
        this.player1.clickCard(this.burnedMen);
    });

    it('kneels to give a defending character -2 STR until the end of the challenge', function () {
        expect(this.weirwoodBow.kneeled).toBe(true);
        expect(this.burnedMen.getStrength()).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });
});
