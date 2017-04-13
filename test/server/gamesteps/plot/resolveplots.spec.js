/*global describe, it, beforeEach, expect, jasmine */
/* eslint no-invalid-this: 0 */

const ResolvePlots = require('../../../../server/game/gamesteps/plot/resolveplots.js');

describe('the ResolvePlots', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['getPlayerByName', 'getFirstPlayer', 'promptWithMenu', 'raiseEvent']);
        this.player = jasmine.createSpyObj('player', ['setPrompt', 'cancelPrompt']);
        this.otherPlayer = jasmine.createSpyObj('player', ['setPrompt', 'cancelPrompt']);
        this.playerPlot = { plot: 1 };
        this.player.activePlot = this.playerPlot;
        this.otherPlayerPlot = { plot: 2 };
        this.otherPlayer.activePlot = this.otherPlayerPlot;

        this.game.getFirstPlayer.and.returnValue(this.otherPlayer);
    });

    describe('the continue() function', function() {
        describe('when no players need resolution', function() {
            beforeEach(function() {
                this.prompt = new ResolvePlots(this.game, []);
            });

            it('should not prompt for ordering', function() {
                this.prompt.continue();
                expect(this.game.promptWithMenu).not.toHaveBeenCalled();
            });

            it('should return true', function() {
                expect(this.prompt.continue()).toBe(true);
            });
        });

        describe('when only one player needs resolution', function() {
            beforeEach(function() {
                this.prompt = new ResolvePlots(this.game, [this.player]);
            });

            it('should not prompt for ordering', function() {
                this.prompt.continue();
                expect(this.game.promptWithMenu).not.toHaveBeenCalled();
            });

            it('should reveal the plot', function() {
                this.prompt.continue();
                expect(this.game.raiseEvent).toHaveBeenCalledWith('onPlotRevealed', this.player, this.playerPlot);
            });

            it('should return true', function() {
                expect(this.prompt.continue()).toBe(true);
            });
        });

        describe('when only more than one player needs resolution', function() {
            beforeEach(function() {
                this.prompt = new ResolvePlots(this.game, [this.player, this.otherPlayer]);
            });

            it('should prompt the first player for ordering', function() {
                this.prompt.continue();
                expect(this.game.promptWithMenu).toHaveBeenCalledWith(this.otherPlayer, this.prompt, jasmine.any(Object));
            });

            it('should not reveal any plot', function() {
                this.prompt.continue();
                expect(this.game.raiseEvent).not.toHaveBeenCalledWith('onPlotRevealed', this.player, this.playerPlot);
                expect(this.game.raiseEvent).not.toHaveBeenCalledWith('onPlotRevealed', this.otherPlayer, this.otherPlayerPlot);
            });

            it('should return false', function() {
                expect(this.prompt.continue()).toBe(false);
            });
        });
    });

    describe('the resolvePlayer() function', function() {
        beforeEach(function() {
            this.prompt = new ResolvePlots(this.game, [this.player, this.otherPlayer]);
        });

        describe('when the player ID does not exist', function() {
            beforeEach(function() {
                this.game.getPlayerByName.and.returnValue(undefined);
            });

            it('should not reveal a plot', function() {
                this.prompt.resolvePlayer(this.player, 54321);
                expect(this.game.raiseEvent).not.toHaveBeenCalledWith('onPlotRevealed', this.player);
                expect(this.game.raiseEvent).not.toHaveBeenCalledWith('onPlotRevealed', this.otherPlayer);
            });

            it('should not modify the resolution list', function() {
                this.prompt.resolvePlayer(this.player, 54321);
                expect(this.prompt.playersWithRevealEffects).toEqual([this.player, this.otherPlayer]);
            });
        });

        describe('when the player ID does exist', function() {
            beforeEach(function() {
                this.game.getPlayerByName.and.returnValue(this.otherPlayer);
            });

            it('should reveal the plot', function() {
                this.prompt.resolvePlayer(this.player, this.otherPlayer.name);
                expect(this.game.raiseEvent).toHaveBeenCalledWith('onPlotRevealed', this.otherPlayer, this.otherPlayerPlot);
            });

            it('should remove the resolved player from the list', function() {
                this.prompt.resolvePlayer(this.player, this.otherPlayer.name);
                expect(this.prompt.playersWithRevealEffects).toEqual([this.player]);
            });
        });
    });
});
