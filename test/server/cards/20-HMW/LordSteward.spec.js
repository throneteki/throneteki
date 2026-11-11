describe('Lord Steward (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Eddard Stark (Core)', attachments: ['Lord Steward (HMW)'] }]
            },
            player2: { inPlay: ['Hot Pie (ToJ)'] }
        });
        expect(this.eddardStark.hasIcon('intrigue')).toBe(true);
        expect(this.eddardStark.hasTrait('Steward')).toBe(true);
        this.unopposedChallenge(this.player1, 'Intrigue', this.eddardStark);
        this.player1.triggerAbility(this.lordSteward);
        this.player1.clickCard(this.hotPie);
    });

    it("gives the attached character an intrigue icon and the Steward trait, and takes control of a losing opponent's character after you win an intrigue challenge with a Steward", function () {
        expect(this.hotPie.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
