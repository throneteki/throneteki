const sample = require('lodash.sample');
const BaseStep = require('./basestep.js');
const SimpleStep = require('./simplestep.js');
const FirstPlayerPrompt = require('./plot/firstplayerprompt.js');
const Event = require('../event');
const RevealPlot = require('../GameActions/RevealPlot');

class RevealPlots extends BaseStep {
    constructor(game, plots, parentEvent = null) {
        super(game);

        this.plots = plots;
        this.parentEvent = parentEvent;
    }

    continue() {
        for(let plot of this.plots) {
            this.game.addMessage('{0} reveals {1}', plot.controller, plot);
        }
        let event = this.generateEvent(this.plots);
        if(this.parentEvent) {
            this.parentEvent.thenAttachEvent(event);
        } else {
            this.game.resolveEvent(event);
        }
    }

    generateEvent(plots) {
        // General sequence:
        // * Simultaneously move each selected plot to the revealed location and
        //   discard the current active plot. This ensures plots are visible on
        //   the board before resolving them.
        // * Interrupts to plots being revealed
        // * Plot card persistent effects are activated
        // * Initiative is compared and first player chosen if a new round
        // * "When revealed" abilities are resolved
        // * Reactions to plots being revealed, plots being discarded
        const event = new Event('_TOP_LEVEL_REVEAL_', {});
        for(const plot of plots) {
            event.addChildEvent(RevealPlot.createEvent({ card: plot, player: plot.controller }));
        }

        event.thenExecute(() => {
            event.thenAttachEvent(this.generateRevealEvent(plots));
            this.game.openInterruptWindowForAttachedEvents(event);
        });

        return event;
    }

    generateRevealEvent(plots) {
        let event = new Event('onPlotsRevealed', { plots: plots }, () => {
            this.game.addSimultaneousEffects(this.getPlotEffects(plots));
            if(this.needsFirstPlayerChoice()) {
                this.game.raiseEvent('onCompareInitiative', {});
                this.game.queueStep(new SimpleStep(this.game, () => this.determineInitiative()));
                this.game.queueStep(() => new FirstPlayerPrompt(this.game, this.initiativeWinner));
            }
        });

        for(let plot of plots) {
            event.addChildEvent(new Event('onPlotRevealed', { plot: plot }));
        }

        return event;
    }

    getPlotEffects(plots) {
        return plots
            .reduce((memo, plot) => {
                let effectProperties = plot.getPersistentEffects();
                let results = effectProperties.map(properties => ({ source: plot, properties: properties }));

                return memo.concat(results);
            }, []);
    }

    needsFirstPlayerChoice() {
        return this.game.getPlayers().every(player => !player.firstPlayer);
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
            if(result.autoTieWinner) {
                this.game.addMessage('{0} won initiative because initiative values were tied and {0} wins ties', initiativeWinner);
            } else {
                this.game.addMessage('{0} won initiative because initiative values were tied but {0} had the lowest power', initiativeWinner);
            }
        } else {
            this.game.addMessage('{0} won initiative', initiativeWinner);
        }

        this.game.raiseEvent('onInitiativeDetermined', { winner: initiativeWinner }, event => {
            this.initiativeWinner = event.winner;
        });
    }

    getInitiativeResult(sampleFunc = sample) {
        let result = { initiativeTied: false, powerTied: false, player: undefined };
        let playerInitiatives = this.game.getPlayers().map(player => {
            return { player: player, initiative: player.getTotalInitiative(), power: player.getTotalPower(), winsTies: player.hasFlag('winsInitiativeTies') };
        });
        let initiativeValues = playerInitiatives.map(p => p.initiative);
        let highestInitiative = Math.max(...initiativeValues);
        let potentialWinners = playerInitiatives.filter(p => p.initiative === highestInitiative);

        result.initiativeTied = potentialWinners.length > 1;

        if(result.initiativeTied) {
            let tieWinners = potentialWinners.filter(p => p.winsTies);
            potentialWinners = tieWinners.length > 0 ? tieWinners : potentialWinners;
            result.autoTieWinner = tieWinners.length === 1;
            
            let powerValues = potentialWinners.map(p => p.power);
            let lowestPower = Math.min(...powerValues);
            potentialWinners = potentialWinners.filter(p => p.power === lowestPower);
        }

        result.powerTied = potentialWinners.length > 1;

        if(potentialWinners.length > 0) {
            result.player = sampleFunc(potentialWinners).player;
        }

        return result;
    }
}

module.exports = RevealPlots;
