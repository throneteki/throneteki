describe('Maege Mormont', function () {
    describe('when you win a challenge with a participating House Mormont character', function () {
        describe('and the top card of your deck is [stark]', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'challenge',
                    player1: {
                        inPlay: ['Maege Mormont', 'Tumblestone Knight'],
                        drawDeck: ['Bran Stark (Core)']
                    }
                });

                this.unopposedChallenge(this.player1, 'Power', this.maegeMormont);
                this.player1.triggerAbility(this.maegeMormont);
            });

            it('reveals it and draws it', function () {
                expect(this.branStark.location).toBe('hand');
                expect(this.game.getPlainTextLog()).toContain(
                    'player1 uses Maege Mormont to reveal the top card of their deck'
                );

                this.player1.clickPrompt('Apply Claim');

                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('and the top card of your deck is not [stark]', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'challenge',
                    player1: {
                        inPlay: ['Maege Mormont'],
                        drawDeck: ['Hedge Knight']
                    }
                });

                this.unopposedChallenge(this.player1, 'Power', this.maegeMormont);
                this.player1.triggerAbility(this.maegeMormont);
            });

            it('reveals it and leaves it on top of your deck', function () {
                expect(this.hedgeKnight.location).toBe('draw deck');
                expect(this.player1Object.drawDeck[0]).toBe(this.hedgeKnight);
                expect(this.player1Object.hand).toHaveLength(0);

                this.player1.clickPrompt('Apply Claim');

                expect(this.player1).isReadyToTakeAction();
            });
        });
    });

    describe('when you win a challenge without a participating House Mormont character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Maege Mormont', 'Tumblestone Knight'],
                    drawDeck: ['Bran Stark (Core)']
                }
            });

            this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);
        });

        it('cannot be triggered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.maegeMormont);

            this.player1.clickPrompt('Apply Claim');

            expect(this.branStark.location).toBe('draw deck');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
