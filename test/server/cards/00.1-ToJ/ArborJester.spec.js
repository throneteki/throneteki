import GameActions from '../../../../server/game/GameActions/index.js';

describe('Arbor Jester', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('tyrell', [
                'Arbor Jester',
                'Margaery Tyrell (Core)',
                'Randyll Tarly (Core)',
                'Loan from the Iron Bank'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.arborJester = this.player1.findCardByName('Arbor Jester', 'hand');
            this.margaery = this.player1.findCardByName('Margaery Tyrell', 'hand');
            this.randyll = this.player1.findCardByName('Randyll Tarly', 'hand');

            this.player1.clickCard(this.arborJester);
            this.player1.clickPrompt('Setup in shadows');

            this.completeSetup();
            this.selectFirstPlayer(this.player1);
        });

        describe('when triggered on a full deck', function () {
            beforeEach(function () {
                this.player1.dragCard(this.margaery, 'draw deck');
                this.player1.dragCard(this.randyll, 'draw deck');
                this.player1.clickCard(this.arborJester);
                this.player1.triggerAbility(this.arborJester);
                spyOn(GameActions, 'revealTopCards').and.callThrough();
                this.player1.clickCard(this.arborJester);
                this.beforeSTR = this.arborJester.getStrength();
            });

            it('should reveal the top two cards of the deck', function () {
                expect(GameActions.revealTopCards).toHaveBeenCalledWith(jasmine.any(Function));
            });

            describe('and a card is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.margaery);
                });

                it('should place the selected card on the bottom of the deck', function () {
                    expect(this.player1Object.drawDeck[0]).toBe(this.randyll);
                });

                it('should buff STR equal to printed cost of not selected card', function () {
                    expect(this.arborJester.getStrength()).toBe(
                        this.beforeSTR + this.randyll.getPrintedCost()
                    );
                });
            });
        });

        describe('when triggered with only one card left in deck', function () {
            beforeEach(function () {
                this.player1.dragCard(this.margaery, 'draw deck');
                this.player1.clickCard(this.arborJester);
                this.player1.triggerAbility(this.arborJester);
                spyOn(GameActions, 'revealTopCards').and.callThrough();
                this.player1.clickCard(this.arborJester);
                this.beforeSTR = this.arborJester.getStrength();
            });

            it('should reveal the only card left in the deck', function () {
                expect(GameActions.revealTopCards).toHaveBeenCalledWith(jasmine.any(Function));
            });

            describe('and a card is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.margaery);
                });

                it('should not buff STR', function () {
                    expect(this.arborJester.getStrength()).toBe(this.beforeSTR);
                });
            });
        });
    });
});
