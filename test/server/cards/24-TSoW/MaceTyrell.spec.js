describe('Mace Tyrell (TSoW)', function () {
    describe('during a challenge with a participating Army', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Mace Tyrell (TSoW)', 'Ranging Party'] },
                player2: { inPlay: ['Tumblestone Knight'] }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.rangingParty);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.tumblestoneKnight);
            this.player2.clickPrompt('Done');
            this.player1.clickMenu(this.maceTyrell, 'Stand and remove Army');
            this.player1.clickCard(this.rangingParty);
            this.player1.clickCard(this.rangingParty);
            this.player1.clickCard(this.tumblestoneKnight);
        });

        it('stands and removes it from the challenge to stand and remove a cheaper participating character', function () {
            expect(this.rangingParty.kneeled).toBe(false);
            expect(this.rangingParty.isParticipating()).toBe(false);
            expect(this.tumblestoneKnight.kneeled).toBe(false);
            expect(this.tumblestoneKnight.isParticipating()).toBe(false);
        });
    });
});
