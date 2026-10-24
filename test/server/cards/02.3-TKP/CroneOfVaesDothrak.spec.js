describe('Crone of Vaes Dothrak', function () {
    function setup({ drawDeck = [], hand = [] }) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Crone of Vaes Dothrak', 'Braided Warrior', "Black Wind's Crew"] },
            player2: { drawDeck, hand }
        });
    }

    describe('when a character is discarded from the deck', function () {
        beforeEach(function () {
            setup.call(this, { drawDeck: ['Hedge Knight'] });
            this.unopposedChallenge(this.player1, 'Power', this.blackWindsCrew);
        });

        it('kneels a Dothraki character to place it in the dead pile', function () {
            this.player1.triggerAbility('Crone of Vaes Dothrak');
            this.player1.clickCard(this.croneOfVaesDothrak);

            expect(this.hedgeKnight.location).toBe('dead pile');
            expect(this.croneOfVaesDothrak.kneeled).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when a non-character is discarded from the deck', function () {
        beforeEach(function () {
            setup.call(this, { drawDeck: ['The Roseroad'] });
            this.unopposedChallenge(this.player1, 'Power', this.blackWindsCrew);
        });

        it('does not trigger', function () {
            expect(this.player1).not.toAllowAbilityTrigger('Crone of Vaes Dothrak');
            expect(this.theRoseroad.location).toBe('discard pile');
        });
    });

    describe('when a character is discarded from hand', function () {
        beforeEach(function () {
            setup.call(this, { hand: ['Hedge Knight'] });
            this.unopposedChallenge(this.player1, 'Intrigue', this.croneOfVaesDothrak);
        });

        it('kneels a Dothraki character to place it in the dead pile', function () {
            this.player1.triggerAbility('Crone of Vaes Dothrak');
            this.player1.clickCard(this.braidedWarrior);

            expect(this.hedgeKnight.location).toBe('dead pile');
            expect(this.braidedWarrior.kneeled).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when a non-character is discarded from hand', function () {
        beforeEach(function () {
            setup.call(this, { hand: ['The Roseroad'] });
            this.unopposedChallenge(this.player1, 'Intrigue', this.croneOfVaesDothrak);
        });

        it('does not trigger', function () {
            expect(this.player1).not.toAllowAbilityTrigger('Crone of Vaes Dothrak');
            expect(this.theRoseroad.location).toBe('discard pile');
        });
    });
});
