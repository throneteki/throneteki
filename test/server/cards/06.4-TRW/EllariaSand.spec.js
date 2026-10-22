describe('Ellaria Sand (TRW)', function () {
    describe('after you lose a challenge she participates in', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [
                        { card: 'Ellaria Sand (TRW)', gold: 1 },
                        { card: 'Bastard in Hiding', kneeling: true }
                    ]
                },
                player2: { inPlay: ['Great Ranging (FtR)'] }
            });
            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard(this.ellariaSand);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.greatRanging);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.triggerAbility(this.ellariaSand);
        });

        it('discards 1 gold from her to stand each Bastard character you control', function () {
            expect(this.ellariaSand.gold).toBe(0);
            expect(this.bastardInHiding.kneeled).toBe(false);
            expect(this.ellariaSand.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
