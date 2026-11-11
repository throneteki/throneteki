describe('Attack From the Mountains', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Timett Son of Timett'],
                hand: ['Attack From the Mountains', 'Shagga Son of Dolf'],
                gold: 2
            }
        });
        this.unopposedChallenge(this.player1, 'Power', this.timettSonOfTimett);
        this.player1.triggerAbility(this.attackFromTheMountains);
        this.player1.clickCard(this.shaggaSonOfDolf);
    });

    it('puts a Clansman character into play from your hand after you win a challenge with an attacking Clansman', function () {
        expect(this.shaggaSonOfDolf.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
