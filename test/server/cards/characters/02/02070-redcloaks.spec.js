/* global describe, it, expect, beforeEach, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const RedCloaks = require('../../../../../server/game/cards/characters/02/redcloaks.js');

describe('RedCloaks', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'once', 'removeListener', 'addPower', 'addMessage', 'addGold', 'addEffect']);
        this.playerSpy = jasmine.createSpyObj('player', ['']);

        this.playerSpy.game = this.gameSpy;

        this.card = new RedCloaks(this.playerSpy, {});
        this.card.location = 'play area';
    });

    describe('addGold', function() {
        describe('when called while i am not in play', function() {
            beforeEach(function() {
                this.card.location = 'discard pile';
                this.playerSpy.gold = 10;
                this.card.addGold(this.playerSpy);
            });

            it('should not add any gold to the card', function() {
                expect(this.card.tokens['gold']).toBe(undefined);
            });
        });

        describe('when called for the first time', function() {
            describe('and my owner has no gold', function() {
                beforeEach(function() {
                    this.playerSpy.gold = 0;
                    this.card.addGold(this.playerSpy);
                });

                it('should not add any gold to the card', function() {
                    expect(this.card.tokens['gold']).toBe(undefined);
                });
            });

            describe('and my owner has gold to move', function() {
                beforeEach(function() {
                    this.playerSpy.gold = 10;
                    this.card.addGold(this.playerSpy);
                });

                it('should add a gold token to the card', function() {
                    expect(this.card.tokens['gold']).toBe(1);
                });

                it('should reduce my owner\'s gold count by 1', function() {
                    expect(this.gameSpy.addGold).toHaveBeenCalledWith(this.playerSpy, -1);
                });
            });
        });
    });
});
