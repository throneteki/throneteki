describe('Foamdrinker', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'greyjoy',
                inPlay: ['Foamdrinker', 'Dagmer Cleftjaw (TS)', "Black Wind's Crew"]
            }
        });
    });

    it('gives Dagmer Cleftjaw assault while you control him, and kneels to give a Captain or Raider character a challenge icon of your choice', function () {
        expect(this.dagmerCleftjaw.hasKeyword('assault')).toBe(true);

        this.player1.clickCard(this.foamdrinker);
        this.player1.clickCard(this.blackWindsCrew);
        this.player1.clickPrompt('Intrigue');

        expect(this.foamdrinker.kneeled).toBe(true);
        expect(this.blackWindsCrew.hasIcon('intrigue')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
