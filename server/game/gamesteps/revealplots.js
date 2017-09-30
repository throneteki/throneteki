const _ = require('underscore');
const BaseStep = require('./basestep.js');
const SimpleStep = require('./simplestep.js');
const FirstPlayerPrompt = require('./plot/firstplayerprompt.js');

class RevealPlots extends BaseStep {
    constructor(game, plots) {
        super(game);

        this.plots = plots;
    }

    continue() {
        this.game.addSimultaneousEffects(this.getPlotEffects());

        for(let plot of this.plots) {
            this.game.raiseEvent('onCardEntersPlay', { card: plot, playingType: 'plot' });
        }

        let params = {
            plots: this.plots
        };
        this.game.raiseEvent('onPlotsRevealed', params, () => {
            if(this.needsFirstPlayerChoice()) {
                this.game.raiseEvent('onCompareInitiative', {});
                this.game.queueStep(new SimpleStep(this.game, () => this.determineInitiative()));
                this.game.queueStep(() => new FirstPlayerPrompt(this.game, this.initiativeWinner));
            }
            this.game.raiseEvent('onPlotsWhenRevealed', params);
        });
    }

    getPlotEffects() {
        return this.plots
            .reduce((memo, plot) => {
                let effectProperties = plot.getPersistentEffects();
                let results = effectProperties.map(properties => ({ source: plot, properties: properties }));

                return memo.concat(results);
            }, []);
    }

    needsFirstPlayerChoice() {
        return _.all(this.game.getPlayers(), player => !player.firstPlayer);
    }

    determineInitiative() {
        let result = this.getInitiativeResult();
        let initiativeWinner = result.player;

        if(!initiativeWinner) {
            return false;
        }

        if(result.powerTied) {
            this.game.addMessage('{0} was randomly selected to win initiative because both initiative values and power were tied', initiativeWinner);
        } else if(result.initiativeTied) {
            this.game.addMessage('{0} won initiative because initiative values were tied but {0} had the lowest power', initiativeWinner);
        } else {
            this.game.addMessage('{0} won initiative', initiativeWinner);
        }

        this.initiativeWinner = initiativeWinner;
        this.game.raiseEvent('onInitiativeDetermined', { winner: initiativeWinner });
    }

    getInitiativeResult(sampleFunc = _.sample) {
        let result = { initiativeTied: false, powerTied: false, player: undefined };
        let playerInitiatives = _.map(this.game.getPlayers(), player => {
            return { player: player, initiative: player.getTotalInitiative(), power: player.getTotalPower() };
        });
        let highestInitiative = _.max(_.pluck(playerInitiatives, 'initiative'));
        let potentialWinners = _.filter(playerInitiatives, p => p.initiative === highestInitiative);

        result.initiativeTied = potentialWinners.length > 1;

        if(result.initiativeTied) {
            let lowestPower = _.min(_.pluck(potentialWinners, 'power'));
            potentialWinners = _.filter(potentialWinners, p => p.power === lowestPower);
        }

        result.powerTied = potentialWinners.length > 1;

        if(potentialWinners.length > 0) {
            result.player = sampleFunc(potentialWinners).player;
        }

        return result;
    }
}

module.exports = RevealPlots;
