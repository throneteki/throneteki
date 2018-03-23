const _ = require('underscore');

const AgendaCard = require('../../agendacard.js');
const RevealPlots = require('../../gamesteps/revealplots.js');

class TheRainsOfCastamere extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDecksPrepared', 'onPlotDiscarded', 'onPlotsRecycled']);
    }

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.challengeType === 'intrigue' &&
                                         event.challenge.winner === this.owner &&
                                         event.challenge.strengthDifference >= 5
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                type: 'select',
                activePromptTitle: 'Select a plot',
                cardCondition: card => card.controller === this.controller && card.location === 'scheme plots',
                cardType: 'plot'
            },
            handler: context => this.trigger(context)
        });

        this.action({
            title: 'Manually trigger',
            cost: ability.costs.kneelFactionCard(),
            target: {
                type: 'select',
                activePromptTitle: 'Select a plot',
                cardCondition: card => card.controller === this.controller && card.location === 'scheme plots',
                cardType: 'plot'
            },
            handler: context => this.trigger(context)
        });
    }

    trigger(context) {
        this.game.addMessage('{0} uses {1} and kneels their faction card to reveal {2}',
            context.player, this, context.target);

        context.player.selectedPlot = context.target;
        context.player.removeActivePlot();
        context.player.flipPlotFaceup();
        this.game.queueStep(new RevealPlots(this.game, [context.target]));
    }

    onDecksPrepared() {
        this.separateSchemePlots();
    }

    onPlotDiscarded(event) {
        if(event.card.controller === this.controller && event.card.hasTrait('Scheme')) {
            this.owner.moveCard(event.card, 'out of game');
        }
    }

    onPlotsRecycled(event) {
        if(event.player === this.controller) {
            this.separateSchemePlots();
        }
    }

    separateSchemePlots() {
        let schemePartition = this.owner.plotDeck.partition(card => card.hasTrait('Scheme'));
        let schemes = schemePartition[0];
        this.owner.plotDeck = _(schemePartition[1]);
        for(let scheme of schemes) {
            this.owner.moveCard(scheme, 'scheme plots');
        }
    }
}

TheRainsOfCastamere.code = '05045';

module.exports = TheRainsOfCastamere;
