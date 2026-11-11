describe('Wylla Manderly', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Wylla Manderly', 'Tumblestone Knight'],
                discard: ['Sweet Cersei']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('places another card from your discard pile on the bottom of your deck after a character you control is killed', function () {
        this.player1.triggerAbility(this.wyllaManderly);
        this.player1.clickCard(this.sweetCersei);

        expect(this.sweetCersei.location).toBe('draw deck');
        expect(this.player2).isReadyToTakeAction();
    });
});
