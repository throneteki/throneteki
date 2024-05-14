import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Chella Daughter of Cheyk', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('lannister', [
                'A Clash of Kings',
                'Chella Daughter of Cheyk'
            ]);
            const deck2 = this.buildDeck('lannister', ['A Clash of Kings', 'Hedge Knight']);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.chella = this.player1.findCardByName('Chella Daughter of Cheyk', 'hand');
            this.chud = this.player2.findCardByName('Hedge Knight', 'hand');

            this.player1.clickCard(this.chella);
            this.player2.clickCard(this.chud);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            this.completeMarshalPhase();
        });

        describe('when Chella gains the 3rd ear after military claim', function () {
            beforeEach(function () {
                this.chella.modifyToken(Tokens.ear, 2);

                this.unopposedChallenge(this.player1, 'military', this.chella);
                this.player1.clickPrompt('Apply Claim');
                this.player2.clickCard(this.chud);
                this.player1.triggerAbility('Chella Daughter of Cheyk');

                expect(this.chella.tokens.ear).toBe(3);
            });

            it('should immediately give Chella renown + intimidate', function () {
                expect(this.chella.power).toBe(1);
                expect(this.chella.hasKeyword('renown')).toBe(true);
                expect(this.chella.hasKeyword('intimidate')).toBe(true);
            });
        });
    });
});
