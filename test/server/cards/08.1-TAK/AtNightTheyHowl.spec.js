describe('At Night They Howl', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'stark',
                inPlay: [{ card: 'Summer (Core)', kneeling: true }],
                hand: ['At Night They Howl'],
                gold: 3
            }
        });
        this.player1.clickCard(this.atNightTheyHowl);
        this.player1.clickCard(this.summer);
        this.player1.clickPrompt('Done');
    });

    it('stands any number of Direwolf characters', function () {
        expect(this.summer.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
