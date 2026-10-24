describe('The Hound (HoT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'lannister', hand: ['The Hound (HoT)'], gold: 4 },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.theHound);
        this.player1.triggerAbility(this.theHound);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it("returns a Knight without attachments to its owner's hand after he enters play", function () {
        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
