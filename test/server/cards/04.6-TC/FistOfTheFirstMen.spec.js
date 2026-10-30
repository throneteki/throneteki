describe('Fist of the First Men', function () {
    describe("while your reserve is higher than an opponent's", function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: {
                    inPlay: ['Fist of the First Men', 'Ranging Party', 'Tumblestone Knight']
                },
                player2: { plot: 'Trading with the Pentoshi', inPlay: ['Varys (Core)'] }
            });
            expect(this.rangingParty.getStrength()).toBe(6);
            this.player2.clickPrompt('Intrigue');
            this.player2.clickCard(this.varys);
            this.player2.clickPrompt('Done');
        });

        it('gives each Ranger you control +1 STR and stops it being bypassed by stealth', function () {
            expect(this.player2).not.toBeAbleToSelect(this.rangingParty);
            expect(this.player2).toBeAbleToSelect(this.tumblestoneKnight);
        });
    });
});
