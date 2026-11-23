describe('Frey Bastard', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Frey Bastard', gold: 1 }, 'Black Walder'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', [this.freyBastard, this.blackWalder]);
        this.player1.triggerAbility(this.freyBastard);
    });

    it('discards 1 gold from itself to gain 1 power for your faction after you win a challenge with 2 attacking House Frey characters', function () {
        expect(this.freyBastard.gold).toBe(0);
        expect(this.player1Object.faction.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
