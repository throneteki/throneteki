describe('This Must Be Answered Fiercely!', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight', 'Bastard in Hiding', 'Khal Drogo (Core)']
            },
            player2: {
                hand: ['This Must Be Answered Fiercely!'],
                drawDeck: ['Tumblestone Knight', 'Courtesan of the Rose']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.bastardInHiding);
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
        this.player2.triggerAbility(this.thisMustBeAnsweredFiercely);
    });

    it('puts a [tyrell] character from your deck into play after 3 or more characters attack you', function () {
        this.player2.clickCard(this.courtesanOfTheRose);

        expect(this.courtesanOfTheRose.location).toBe('play area');

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
