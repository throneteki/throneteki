describe('Begging Brother', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Trading with the Pentoshi',
                hand: ['Begging Brother', 'Tanda Stokeworth', 'House Florent Knight']
            },
            player2: { hand: ['Tanda Stokeworth'] }
        });
        this.tanda1 = this.player1.findCardByName('Tanda Stokeworth', 'hand');
        this.tanda2 = this.player2.findCardByName('Tanda Stokeworth', 'hand');
        this.player1.clickCard(this.beggingBrother);
        this.player1.clickPrompt('2');
    });

    describe('when you trigger a non-forced character ability', function () {
        beforeEach(function () {
            this.player1.clickCard(this.tanda1);
            this.goldBefore = this.player1Object.gold;
            this.player1.triggerAbility(this.tanda1);
        });

        it('does not prompt to cancel it', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.beggingBrother);
            expect(this.player1Object.gold).toBe(this.goldBefore + 3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when you trigger a forced character ability', function () {
        beforeEach(function () {
            this.player1.clickCard(this.houseFlorentKnight);
            this.player1.clickCard(this.houseFlorentKnight);
        });

        it('discards 1 gold from itself to cancel the ability', function () {
            expect(this.player1).toAllowAbilityTrigger(this.beggingBrother);

            this.player1.triggerAbility(this.beggingBrother);

            expect(this.beggingBrother.gold).toBe(1);
            expect(this.houseFlorentKnight.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when an opponent triggers a character ability', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.tanda2);
            this.goldBefore = this.player2Object.gold;
            this.player2.triggerAbility(this.tanda2);
        });

        it('discards 1 gold from itself to cancel the ability', function () {
            expect(this.player1).toAllowAbilityTrigger(this.beggingBrother);

            this.player1.triggerAbility(this.beggingBrother);

            expect(this.beggingBrother.gold).toBe(1);
            expect(this.player2Object.gold).toBe(this.goldBefore);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
