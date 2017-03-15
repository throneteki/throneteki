/* global describe, it, beforeEach, expect, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const Player = require('../../../server/game/player.js');

describe('Player', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'raiseEvent', 'getOtherPlayer', 'playerDecked', 'resolveAbility']);
        this.player = new Player('1', 'Player 1', true, this.gameSpy);
        this.player.initialise();
    });

    describe('playCard', function() {
        beforeEach(function() {
            this.playActionSpy = jasmine.createSpyObj('playAction', ['meetsRequirements', 'canPayCosts']);
            this.cardSpy = jasmine.createSpyObj('card', ['getPlayActions']);

            this.player.hand.push(this.cardSpy);
            this.cardSpy.location = 'hand';
            this.cardSpy.controller = this.player;
        });

        describe('when card is undefined', function() {
            beforeEach(function() {
                this.player.hand.pop();
                this.canPlay = this.player.playCard(undefined);
            });

            it('should return false', function() {
                expect(this.canPlay, false).toBe(false);
            });

            it('should not put the card in play', function() {
                expect(this.player.cardsInPlay).not.toContain(this.cardSpy);
            });
        });

        describe('when card has play actions', function() {
            beforeEach(function() {
                this.cardSpy.getPlayActions.and.returnValue([this.playActionSpy]);
            });

            describe('when the requirements are met and the costs can be paid', function() {
                beforeEach(function() {
                    this.playActionSpy.meetsRequirements.and.returnValue(true);
                    this.playActionSpy.canPayCosts.and.returnValue(true);
                });

                it('should resolve the play action', function() {
                    this.player.playCard(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).toHaveBeenCalledWith(this.playActionSpy, { game: this.gameSpy, player: this.player, source: this.cardSpy });
                });

                it('should return true', function() {
                    expect(this.player.playCard(this.cardSpy)).toBe(true);
                });
            });

            describe('when the requirements are met but the costs cannot be paid', function() {
                beforeEach(function() {
                    this.playActionSpy.meetsRequirements.and.returnValue(true);
                    this.playActionSpy.canPayCosts.and.returnValue(false);
                });

                it('should not resolve the play action', function() {
                    this.player.playCard(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });

                it('should return false', function() {
                    expect(this.player.playCard(this.cardSpy)).toBe(false);
                });
            });

            describe('when the costs can be paid but the requirements are not met', function() {
                beforeEach(function() {
                    this.playActionSpy.meetsRequirements.and.returnValue(false);
                    this.playActionSpy.canPayCosts.and.returnValue(true);
                });

                it('should not resolve the play action', function() {
                    this.player.playCard(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });

                it('should return false', function() {
                    expect(this.player.playCard(this.cardSpy)).toBe(false);
                });
            });
        });
    });
});
