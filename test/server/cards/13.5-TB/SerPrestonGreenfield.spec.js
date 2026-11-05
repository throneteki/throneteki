describe('Ser Preston Greenfield', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Preston Greenfield'] },
            player2: {
                power: 1,
                inPlay: ['Hot Pie (FFH)', { card: 'Khal Drogo (Core)', kneeling: true }]
            }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.serPrestonGreenfield);
        this.player1.triggerAbility(this.serPrestonGreenfield);
        this.player2.clickCard(this.hotPie);
    });

    it('has the losing opponent move 1 power from their faction card to a standing character they control after you win a challenge he participates in', function () {
        expect(this.hotPie.power).toBe(1);
        expect(this.player2Object.faction.power).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
