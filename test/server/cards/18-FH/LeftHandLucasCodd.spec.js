import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Left-Hand Lucas Codd', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('tyrell', [
                'Marching Orders',
                'Left-Hand Lucas Codd',
                'Hedge Knight'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.lucas = this.player1.findCardByName('Left-Hand Lucas Codd');
            this.hedge = this.player2.findCardByName('Hedge Knight');
            this.player1.clickCard(this.lucas);
            this.player2.clickCard(this.hedge);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();
        });

        describe('after your opponent declares no defenders in a challenge with an attacking Raider', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.lucas);
                this.player1.clickPrompt('Done');
                this.player1.clickCard(this.hedge);
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
            });

            it('it should place 1 gold on a character', function () {
                expect(this.player1).toHavePrompt('Any reactions?');
                this.player1.clickCard(this.lucas);
                expect(this.player1).toHavePrompt('Select card to place 1 gold on');
                expect(this.lucas.hasToken(Tokens.gold)).toBe(false);
                this.player1.clickCard(this.lucas);
                expect(this.lucas.hasToken(Tokens.gold)).toBe(true);
            });
        });

        describe('after your opponent declares defenders in a challenge with an attacking Raider', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.lucas);
                this.player1.clickPrompt('Done');
                //skip stealth target
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickCard(this.hedge);
                this.player2.clickPrompt('Done');
            });

            it('it should NOT place 1 gold on a character', function () {
                expect(this.player1).toHavePrompt('Initiate an action');
            });
        });
    });
});
