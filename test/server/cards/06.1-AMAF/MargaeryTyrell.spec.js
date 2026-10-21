describe('Margaery Tyrell (AMAF)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Margaery Tyrell (AMAF)', 'Robb Stark (AtSK)'],
                drawDeck: ['Joffrey Baratheon (Core)']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.robbStark);
    });

    it('puts a unique King or Lord from your deck into play after a unique King or Lord you control is killed', function () {
        this.player1.triggerAbility(this.margaeryTyrell);
        this.player1.clickCard(this.joffreyBaratheon);

        expect(this.joffreyBaratheon.location).toBe('play area');
        this.player1.clickPrompt('Pass');

        expect(this.player2).isReadyToTakeAction();
    });
});
