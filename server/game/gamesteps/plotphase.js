const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const SelectPlotPrompt = require('./plot/selectplotprompt.js');
const FirstPlayerPrompt = require('./plot/firstplayerprompt.js');
const RevealPlotOrderPrompt = require('./plot/revealplotorderprompt.js');

class PlotPhase extends Phase {
    constructor(game) {
        super(game);
        this.initialise([
            new SimpleStep(game, () => this.startPlotPhase()),
            new SelectPlotPrompt(game),
            new SimpleStep(game, () => this.flipPlotsFaceup()),
            new SimpleStep(game, () => this.determineInitiative()),
            () => {
                return new FirstPlayerPrompt(game, this.initiativeWinner);
            },
            new SimpleStep(game, () => this.startPlotRevealEffects()),
            new RevealPlotOrderPrompt(game)
        ]);
    }

    startPlotPhase() {
        _.each(this.game.getPlayers(), player => {
            player.startPlotPhase();
        });
    }

    startPlotRevealEffects() {
        if(!_.any(this.game.getPlayers(), player => {
            return player.activePlot.hasRevealEffect() && !player.revealFinished;
        })) {
            return;
        }
    }

    flipPlotsFaceup() {
        this.game.emit('onPlotFlip');

        _.each(this.game.getPlayers(), player => {
            player.flipPlotFaceup();
        });
    }

    determineInitiative() {
        var initiativeWinner = undefined;
        var highestInitiative = -1;
        var lowestPower = -1;

        _.each(this.game.getPlayers(), p => {
            var playerInitiative = p.getTotalInitiative();
            var playerPower = p.power;

            if(playerInitiative === highestInitiative) {
                if(playerPower === lowestPower) {
                    var randomNumber = _.random(0, 1);
                    if(randomNumber === 0) {
                        highestInitiative = playerInitiative;
                        lowestPower = playerPower;
                        initiativeWinner = p;
                    }
                }

                if(playerPower < lowestPower) {
                    highestInitiative = playerInitiative;
                    lowestPower = playerPower;
                    initiativeWinner = p;
                }
            }

            if(playerInitiative > highestInitiative) {
                highestInitiative = playerInitiative;
                lowestPower = playerPower;
                initiativeWinner = p;
            }
        });

        this.initiativeWinner = initiativeWinner;
    }
}

module.exports = PlotPhase;
