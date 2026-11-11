describe('Yronwood', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'martell', inPlay: ['Yronwood'] },
            player2: { inPlay: ['Theon Greyjoy (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.theonGreyjoy);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.triggerAbility(this.theonGreyjoy);
        this.player1.triggerAbility(this.yronwood);
    });

    it("kneels to cancel the effects of an opponent's reaction to winning a challenge", function () {
        expect(this.yronwood.kneeled).toBe(true);
        expect(this.theonGreyjoy.power).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });
});
