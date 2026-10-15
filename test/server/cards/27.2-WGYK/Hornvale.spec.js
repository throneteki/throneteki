import GameActions from '../../../../server/game/GameActions/index.js';

describe('Hornvale', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('lannister', [
                'A Noble Cause',
                'Hornvale (WGYK)',
                'Cersei Lannister (Core)'
            ]);
            const deck2 = this.buildDeck('stark', [
                'A Noble Cause',
                'Hedge Knight',
                'Winterfell Steward',
                'Winterfell Steward',
                'Winterfell Steward'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.hornvale = this.player1.findCardByName('Hornvale', 'hand');
            this.cersei = this.player1.findCardByName('Cersei Lannister', 'hand');

            this.player1.clickCard(this.hornvale);
            this.player1.clickCard(this.cersei);
            this.completeSetup();
            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();

            this.unopposedChallenge(this.player1, 'Intrigue', this.cersei);
        });

        it('should allow Hornvale to trigger after winning an intrigue challenge', function () {
            expect(this.player1).toAllowAbilityTrigger(this.hornvale);
        });

        describe('when triggered', function () {
            beforeEach(function () {
                this.player1.triggerAbility(this.hornvale);
                this.chosenCard = this.player2Object.hand[0];
                this.player2.clickCard(this.chosenCard);
            });

            it('should kneel Hornvale', function () {
                expect(this.hornvale.kneeled).toBe(true);
            });

            it('should place the chosen card facedown under Hornvale', function () {
                expect(this.hornvale.underneath).toContain(this.chosenCard);
                expect(this.chosenCard.facedown).toBe(true);
            });

            describe('and Hornvale leaves play', function () {
                beforeEach(function () {
                    this.game.resolveGameAction(GameActions.discardCard({ card: this.hornvale }));
                    this.game.continue();
                });

                it("should return the card to its owner's hand", function () {
                    expect(this.chosenCard.location).toBe('hand');
                    expect(this.player2Object.hand).toContain(this.chosenCard);
                });
            });
        });
    });
});
