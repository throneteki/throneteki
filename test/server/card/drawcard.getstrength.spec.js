/*global describe, it, beforeEach, expect, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const DrawCard = require('../../../server/game/drawcard.js');

describe('DrawCard', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['raiseMergedEvent']);
        this.player = jasmine.createSpyObj('player', ['discardCard']);
        this.player.game = this.game;
        this.card = new DrawCard(this.player, { strength: 3 });
    });

    describe('getStrength()', function() {
        describe('when the strength has been modified', function() {
            beforeEach(function() {
                this.card.modifyStrength(1);
            });

            it('should return the modified strength', function() {
                expect(this.card.getStrength()).toBe(4);
            });
        });

        describe('when the strength has been modified below 0', function() {
            beforeEach(function() {
                this.card.modifyStrength(-4);
            });

            it('should return 0', function() {
                expect(this.card.getStrength()).toBe(0);
            });
        });

        describe('when the strength has been multiplied', function() {
            beforeEach(function() {
                this.card.modifyStrengthMultiplier(2);
                this.card.modifyStrength(1);
            });

            it('should return the strength multiplied after addition/subtraction modifiers have been applied', function() {
                expect(this.card.getStrength()).toBe(8);
            });
        });

        describe('when the strength becomes fractional', function() {
            beforeEach(function() {
                this.card.modifyStrengthMultiplier(0.5);
            });

            it('should return the rounded strength', function() {
                expect(this.card.getStrength()).toBe(2);
            });
        });

        describe('when requesting printed strength', function() {
            beforeEach(function() {
                this.card.modifyStrength(1);
                this.card.modifyStrengthMultiplier(2);
            });

            it('should return the base strength', function() {
                expect(this.card.getPrintedStrength()).toBe(3);
            });
        });
    });
});
