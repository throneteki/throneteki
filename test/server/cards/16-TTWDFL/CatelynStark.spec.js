describe('Catelyn Stark (TTWDFL)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { hand: ['Catelyn Stark (TTWDFL)'] },
            player2: { inPlay: ['Courtesan of the Rose'] }
        });
        this.player2.clickPrompt('Intrigue');
        this.player2.clickCard(this.courtesanOfTheRose);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('Pass');
        this.player1.clickCard(this.catelynStark);
    });

    it('comes into play knelt as a defender during an intrigue challenge, and returns to hand at the end of the phase', function () {
        expect(this.catelynStark.location).toBe('play area');
        expect(this.catelynStark.kneeled).toBe(true);
        expect(this.catelynStark.isDefending()).toBe(true);
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.completeChallengesPhase();
        expect(this.catelynStark.location).toBe('hand');
    });
});
