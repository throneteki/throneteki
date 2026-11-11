describe('Stormlands Fiefdom', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { inPlay: ['Stormlands Fiefdom'] } });
    });

    it('raises your income by 1', function () {
        expect(this.player1Object.gold).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Stormlands Fiefdom', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Stormlands Fiefdom', { card: 'Tumblestone Knight', power: 1 }] }
        });
        this.player1.clickCard(this.stormlandsFiefdom);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it("kneels to move 1 power from a character or location to its owner's faction card", function () {
        expect(this.tumblestoneKnight.power).toBe(0);
        expect(this.player1Object.faction.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
