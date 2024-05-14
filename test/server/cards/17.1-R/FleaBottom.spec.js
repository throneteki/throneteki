import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Flea Bottom', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('targaryen', [
                'Trading with the Pentoshi',
                'Flea Bottom (R)',
                'Drogon (Core)',
                'Drogon (Core)',
                'Hedge Knight'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            [this.character, this.dupe] = this.player1.filterCardsByName('Drogon', 'hand');
            this.fleaBottom = this.player1.findCardByName('Flea Bottom', 'hand');
            this.player1.clickCard(this.fleaBottom);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            this.fleaBottom.modifyToken(Tokens.gold, 1);

            // Drag filler card back to deck so that the "bottom of deck" condition
            // can be checked.
            let fillerCard = this.player1.findCardByName('Hedge Knight', 'hand');
            this.player1.dragCard(fillerCard, 'draw deck');
        });

        describe('when putting out a character', function () {
            beforeEach(function () {
                this.player1.dragCard(this.character, 'discard pile');

                this.completeMarshalPhase();
                this.player1.clickMenu(this.fleaBottom, 'Put character into play');

                this.player1.clickCard(this.character);
            });

            it('should put the character into play', function () {
                expect(this.character.location).toBe('play area');
            });

            describe('and the character is in play when the phase ends', function () {
                beforeEach(function () {
                    this.completeChallengesPhase();
                });

                it('should return the character to the bottom of the deck', function () {
                    expect(this.character.location).toBe('draw deck');
                    expect(this.player1Object.drawDeck.slice(-1)[0]).toBe(this.character);
                });
            });

            describe('and the character leaves play before the phase ends', function () {
                beforeEach(function () {
                    this.game.killCharacter(this.character);
                    this.completeChallengesPhase();
                });

                it('should not return the character to the bottom of the deck', function () {
                    expect(this.character.location).not.toBe('draw deck');
                });
            });
        });

        describe('when putting out a duplicate', function () {
            beforeEach(function () {
                this.player1.dragCard(this.dupe, 'discard pile');

                this.player1.clickCard(this.character);

                this.completeMarshalPhase();
                this.player1.clickMenu(this.fleaBottom, 'Put character into play');

                this.player1.clickCard(this.dupe);
            });

            it('should duplicate the character', function () {
                expect(this.character.dupes).toContain(this.dupe);
                expect(this.dupe.location).toBe('duplicate');
            });

            describe('and the dupe is in play when the phase ends', function () {
                beforeEach(function () {
                    this.completeChallengesPhase();
                });

                it('should remove the dupe from the character', function () {
                    expect(this.character.dupes).not.toContain(this.dupe);
                });

                it('should return the dupe to the bottom of the deck', function () {
                    expect(this.dupe.location).toBe('draw deck');
                    expect(this.player1Object.drawDeck.slice(-1)[0]).toBe(this.dupe);
                });
            });

            describe('and the dupe leaves play before the phase ends', function () {
                beforeEach(function () {
                    this.game.killCharacter(this.character);
                    this.completeChallengesPhase();
                });

                it('should not return the character to the bottom of the deck', function () {
                    expect(this.dupe.location).not.toBe('draw deck');
                });
            });
        });
    });
});
