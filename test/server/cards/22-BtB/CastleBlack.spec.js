describe('Castle Black (BtB)', function () {
    describe('after a challenge is initiated against you', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: {
                    inPlay: ['Castle Black (BtB)', { card: 'Old Forest Hunter', kneeling: true }]
                },
                player2: { inPlay: ['Castle Guard'] }
            });
            this.player2.clickPrompt('Military');
            this.player2.clickCard(this.castleGuard);
            this.player2.clickPrompt('Done');
            this.player1.triggerAbility(this.castleBlack);
            this.player1.clickCard(this.oldForestHunter);
        });

        it("stands a Night's Watch character", function () {
            expect(this.oldForestHunter.kneeled).toBe(false);
        });
    });

    describe("when an opponent's triggered location ability would initiate", function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Castle Black (BtB)'] },
                player2: { inPlay: ['Dragonstone Port'] }
            });
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.dragonstonePort);
            this.player1.triggerAbility(this.castleBlack);
        });

        it('kneels to cancel it', function () {
            expect(this.castleBlack.kneeled).toBe(true);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
