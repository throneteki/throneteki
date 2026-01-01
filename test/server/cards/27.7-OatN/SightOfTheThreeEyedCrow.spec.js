// Generated with Claude Code - claude-opus-4-5-20251101
// - 2026-01-25: Implement spec for Sight of the Three-Eyed Crow

describe('Sight of the Three-Eyed Crow', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('stark', [
                'Sight of the Three-Eyed Crow',
                'A Noble Cause',
                'Eddard Stark (Core)'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('when a card enters play', function () {
            beforeEach(function () {
                this.player1.addCards([
                    'Arya Stark (Core)',
                    'Catelyn Stark (WotN)',
                    'The Kingsroad'
                ]);
                // Marshal Eddard (cost 5)
                this.player1.clickCard('Eddard Stark', 'hand');
            });

            it('should allow searching for a card of the same type and cost', function () {
                expect(this.player1).toAllowAbilityTrigger('Sight of the Three-Eyed Crow');
            });

            describe('when the ability is triggered', function () {
                beforeEach(function () {
                    this.player1.triggerAbility('Sight of the Three-Eyed Crow');
                });

                it('should search for a card with same type and cost', function () {
                    expect(this.player1).toAllowSelect('Catelyn Stark');
                    expect(this.player1).not.toAllowSelect('Arya Stark');
                    expect(this.player1).not.toAllowSelect('The Kingsroad');
                });
            });
        });
    });

    integration(function () {
        describe('when a card is played (event)', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'Sight of the Three-Eyed Crow',
                    'A Noble Cause',
                    'Winter Is Coming',
                    'Tears of Lys',
                    'Eddard Stark (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.player1.clickCard('Eddard Stark', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.addCards(['Put to the Torch', 'Winterfell Steward']);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Military');
                this.player1.clickCard('Eddard Stark', 'play area');
                this.player1.clickPrompt('Done');

                this.player1.clickCard('Winter Is Coming', 'hand');
            });

            it('should allow triggering on played events', function () {
                expect(this.player1).toAllowAbilityTrigger('Sight of the Three-Eyed Crow');
            });

            describe('when the ability is triggered', function () {
                beforeEach(function () {
                    this.player1.triggerAbility('Sight of the Three-Eyed Crow');
                });

                it('should search for a card with same type and cost', function () {
                    expect(this.player1).toAllowSelect('Put to the Torch');
                    expect(this.player1).not.toAllowSelect('Winterfell Steward');
                });
            });
        });
    });
});
