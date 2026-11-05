describe('The Warden of the East', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Oldtown City Watch'],
                inPlay: [{ card: 'Harry the Heir', attachments: ['The Warden of the East'] }]
            },
            player2: { drawDeck: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.oldtownCityWatch);
        this.player1.triggerAbility(this.oldtownCityWatch);
        this.player1.triggerAbility(this.theWardenOfTheEast);
    });

    it("gives the attached character +2 STR and Commander, and 1 power after a character is revealed from an opponent's deck", function () {
        expect(this.harryTheHeir.getStrength()).toBe(5);
        expect(this.harryTheHeir.hasTrait('Commander')).toBe(true);
        expect(this.harryTheHeir.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
