describe('The Starry Sept', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'The Starry Sept', power: 1 }] },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.clickCard(this.theStarrySept);
        this.player1.clickCard(this.khalDrogo);
    });

    it('moves 1 power from itself to a character and blanks that character until the end of the phase', function () {
        expect(this.khalDrogo.power).toBe(1);
        expect(this.khalDrogo.isAnyBlank()).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('The Starry Sept', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Starry Sept', 'Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);
        this.player1.triggerAbility(this.theStarrySept);
    });

    it('gains 1 power after you win a power challenge', function () {
        expect(this.theStarrySept.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
