describe('Armed to the Teeth', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: 'Armed to the Teeth',
                deck: ["Widow's Wail"],
                inPlay: ['Hedge Knight'],
                gold: 3
            },
            beforeMulligan() {
                this.player1.clickCard(this.widowsWail);
                this.player1.clickPrompt('Done');
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('Armed to the Teeth');
        this.player1.clickCard(this.widowsWail);
        this.player1.clickCard(this.hedgeKnight);
    });

    it('kneels your faction card and pays X gold after you win to put an attachment with cost X into play from under it', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.widowsWail.parent).toBe(this.hedgeKnight);
        expect(this.player1Object.gold).toBe(2);
    });
});
