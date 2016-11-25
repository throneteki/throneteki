const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const SelectPlotPrompt = require('./plot/selectplotprompt.js');
const FirstPlayerPrompt = require('./plot/firstplayerprompt.js');

class PlotPhase extends Phase {
    constructor(game) {
        super(game);
        this.initialise([
            new SimpleStep(game, () => this.startPlotPhase()),
            new SelectPlotPrompt(game),
            new SimpleStep(game, () => this.flipPlotsFaceup()),
            new SimpleStep(game, () => this.determineInitiative())
        ]);
    }

    startPlotPhase() {
        _.each(this.game.getPlayers(), player => {
            player.startPlotPhase();
        });
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

        this.game.queueStep(new FirstPlayerPrompt(this.game, initiativeWinner));
    }
}

module.exports = PlotPhase;
