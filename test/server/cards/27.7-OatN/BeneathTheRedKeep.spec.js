// Generated with Claude Code - claude-opus-4-5-20251101
// - 2026-02-01: Updated to use new test helpers (initiateChallenge, declareDefenders, applyClaim, setupCards)

describe('Beneath the Red Keep', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('lannister', [
                'Beneath the Red Keep',
                'Cersei Lannister (LoCR)'
            ]);
            const deck2 = this.buildDeck('stark', ['A Noble Cause', 'Arya Stark (Core)']);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.cersei = this.player1.findCardByName('Cersei Lannister', 'hand');

            this.arya = this.player2.findCardByName('Arya Stark', 'hand');

            this.player1.setupCards(this.cersei);
            this.player2.setupCards(this.arya);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            this.completeMarshalPhase();

            // Initiate an intrigue challenge against player 2
            this.player1.initiateChallenge({ type: 'intrigue', attackers: this.cersei });
            this.skipActionWindow();
            this.player2.declareDefenders([]);
            this.skipActionWindow();
            this.player1.applyClaim();
        });

        describe('when Beneath the Red Keep is active', function () {
            it('should prevent triggering abilities on characters', function () {
                // Cersei normally has a reaction when an opponent discards cards
                // But with Beneath the Red Keep, she should not be able to trigger it
                expect(this.player1).not.toAllowAbilityTrigger('Cersei Lannister');
            });
        });
    });

    integration(function () {
        describe('when a card has shadow keyword', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('lannister', [
                    'Beneath the Red Keep',
                    { name: 'Scheming Septon', count: 20 }
                ]);
                const deck2 = this.buildDeck('stark', ['A Noble Cause', 'Hedge Knight']);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.septon = this.player1.findCardByName('Scheming Septon', 'hand');
                this.player1.setupCards(this.septon);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
            });

            it('should allow triggering abilities on shadow cards', function () {
                this.player1.clickMenu(this.septon, 'Draw 1 card and gain 2 gold');
                // If Scheming Septon succeeds, it will be on top of the draw deck.
                expect(this.septon.location).toEqual('draw deck');
            });
        });
    });
});
