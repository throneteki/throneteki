describe('Black Lorren', function () {
    describe('after you win a challenge he attacks in', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: [{ card: 'Black Lorren (HMW)', gold: 1 }] },
                player2: { inPlay: ['Hedge Knight'] }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.blackLorren);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.hedgeKnight);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.triggerAbility(this.blackLorren);
            this.player1.clickCard(this.blackLorren);
            this.player1.clickCard(this.hedgeKnight);
        });

        it('discards 1 gold from an attacking Raider to kill a defending character', function () {
            expect(this.blackLorren.gold).toBe(0);
            expect(this.hedgeKnight.location).toBe('dead pile');
        });
    });
});
