describe('The Age of Heroes', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'The Age of Heroes',
                drawDeck: ['Tumblestone Knight', 'Longclaw']
            }
        });

        this.completeMarshalPhase();
        this.player1.triggerAbility(this.theAgeOfHeroes);
    });

    it('kneels your faction card to search your deck for a Legacy or Valyrian Steel attachment', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.longclaw);

        expect(this.longclaw.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
