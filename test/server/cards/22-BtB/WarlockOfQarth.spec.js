describe('Warlock of Qarth', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'targaryen', inPlay: ['Warlock of Qarth', 'Ser Ilyn Payne'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickCard(this.serIlynPayne);
        this.player1.clickCard(this.burnedMen);
        this.player1.triggerAbility(this.warlockOfQarth);
    });

    it("sacrifices itself to put a character into play under your control with insight after it enters an opponent's dead pile, and returns it to the dead pile at the end of the phase", function () {
        expect(this.burnedMen.controller).toBe(this.player1Object);
        expect(this.burnedMen.hasKeyword('insight')).toBe(true);

        this.completeMarshalPhase();

        expect(this.burnedMen.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
