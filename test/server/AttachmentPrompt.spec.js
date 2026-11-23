describe('attachment prompt', function () {
    describe('when an attachment is marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Disputed Claim'],
                    inPlay: ['Targaryen Loyalist']
                },
                player2: {
                    inPlay: ['Viserys Targaryen (AtSK)']
                }
            });
            this.goldBefore = this.player1Object.gold;
            this.player1.clickCard(this.disputedClaim);
        });

        it('cannot be cancelled once the cost is paid', function () {
            expect(this.player1).toHavePrompt('Select target for attachment');
            expect(this.player1).toHaveDisabledPromptButton('Done');
            expect(this.player1Object.gold).toBe(this.goldBefore - 1);
            expect(this.disputedClaim.location).toBe('hand');
        });

        it('attaches to the chosen card, even one an opponent controls', function () {
            expect(this.player1).toBeAbleToSelect(this.viserysTargaryen);
            expect(this.player1).not.toBeAbleToSelect(this.targaryenLoyalist);

            this.player1.clickCard(this.viserysTargaryen);

            expect(this.disputedClaim.location).toBe('play area');
            expect(this.disputedClaim.parent).toBe(this.viserysTargaryen);
            expect(this.disputedClaim.controller).toBe(this.player1Object);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
