describe('I Pledge My Life and Honor (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['I Pledge My Life and Honor (HMW)'],
                inPlay: ['Ser Jaime Lannister (Core)', 'Grand Maester Pycelle (Core)'],
                drawDeck: ['Maester Harmune', 'Tumblestone Knight']
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.serJaimeLannister);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.iPledgeMyLifeAndHonor);
    });

    it('puts a thenightswatch character from the top 10 cards into play after you win as the defender, then sacrifices a character sharing a Trait with it', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.maesterHarmune);

        expect(this.player1).not.toBeAbleToSelect(this.serJaimeLannister);

        this.player1.clickCard(this.grandMaesterPycelle);

        expect(this.maesterHarmune.location).toBe('play area');
        expect(this.grandMaesterPycelle.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
