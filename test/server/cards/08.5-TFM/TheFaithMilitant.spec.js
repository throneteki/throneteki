describe('The Faith Militant', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { agenda: 'The Faith Militant', inPlay: ["Warrior's Sons (FotOG)"] },
            player2: { power: 1 }
        });
        this.unopposedChallenge(this.player1, 'Military', this.warriorsSons);
        this.player1.triggerAbility(this.theFaithMilitant);
        this.player1.clickCard(this.warriorsSons);
    });

    it("kneels your faction card to move 1 power from the losing opponent's faction card to a participating The Seven character after you win a challenge", function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.warriorsSons.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('The Faith Militant', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { agenda: 'The Faith Militant', inPlay: ['Khal Drogo (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.khalDrogo);
    });

    it('stops non-The Seven characters you control gaining power', function () {
        expect(this.khalDrogo.power).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
