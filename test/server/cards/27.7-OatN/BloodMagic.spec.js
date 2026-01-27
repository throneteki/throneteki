// Generated with Claude Code - claude-opus-4-5-20251101
// - 2026-01-26: Implement Blood Magic

describe('Blood Magic', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('targaryen', [
                'Blood Magic',
                'Daenerys Targaryen (Core)',
                'Viserys Targaryen (Core)',
                'Khal Drogo (Core)',
                'Handmaiden'
            ]);
            const deck2 = this.buildDeck('lannister', ['A Noble Cause', 'Hedge Knight']);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.dany = this.player1.findCardByName('Daenerys Targaryen', 'hand');
            this.viserys = this.player1.findCardByName('Viserys Targaryen', 'hand');
            this.drogo = this.player1.findCardByName('Khal Drogo', 'hand');
            this.handmaiden = this.player1.findCardByName('Handmaiden', 'hand');

            this.player1.clickCard(this.dany);
            this.player1.clickCard(this.viserys);

            this.completeSetup();

            // Put Drogo in dead pile
            this.player1Object.moveCard(this.drogo, 'dead pile');
        });

        describe('when Blood Magic is revealed', function () {
            beforeEach(function () {
                this.selectFirstPlayer(this.player1);
            });

            it('should prompt to select a unique character to kill', function () {
                expect(this.player1).toHavePrompt('Select card to kill');
                expect(this.player1).toAllowSelect(this.dany);
                expect(this.player1).not.toAllowSelect(this.viserys);
            });

            describe('when killing a character with equal or higher cost than dead pile target', function () {
                beforeEach(function () {
                    // Kill Dany (cost 7) to bring back Drogo (cost 7)
                    this.player1.clickCard(this.dany);
                });

                it('should prompt to select a character from dead pile', function () {
                    expect(this.player1).toHavePrompt('Select a character');
                });

                it('should allow selecting a character with equal cost', function () {
                    this.player1.clickCard(this.drogo);
                    expect(this.drogo.location).toBe('play area');
                    expect(this.dany.location).toBe('dead pile');
                });
            });
        });
    });

    integration(function () {
        describe('when there are no valid targets in dead pile', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('targaryen', [
                    'Blood Magic',
                    'Viserys Targaryen (Core)',
                    'Handmaiden'
                ]);
                const deck2 = this.buildDeck('lannister', ['A Noble Cause']);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.viserys = this.player1.findCardByName('Viserys Targaryen', 'hand');
                this.handmaiden = this.player1.findCardByName('Handmaiden', 'hand');

                this.player1.clickCard(this.viserys);

                this.completeSetup();

                // Dead pile is empty
                this.selectFirstPlayer(this.player1);
            });

            it('should not trigger', function () {
                expect(this.player1).not.toHavePrompt('Select a character');
            });
        });
    });
});
