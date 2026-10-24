describe('Every Captain is a King', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Drumm'], hand: ['Every Captain is a King'] }
        });
        this.player1.clickCard(this.everyCaptainIsAKing);
    });

    it('gives each Captain you control the King trait', function () {
        expect(this.theDrumm.hasTrait('King')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('stops each Captain you control kneeling when declared as an attacker in a power challenge', function () {
        this.unopposedChallenge(this.player1, 'Power', this.theDrumm);

        expect(this.theDrumm.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
