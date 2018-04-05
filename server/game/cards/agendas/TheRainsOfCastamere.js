const AgendaCard = require('../../agendacard');
const RevealPlots = require('../../gamesteps/revealplots');

class TheRainsOfCastamere extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPlotDiscarded']);
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
                cardCondition: card => card.controller === this.controller && card.hasTrait('scheme'),
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
                cardCondition: card => card.controller === this.controller && card.hasTrait('scheme'),
                cardType: 'plot'
            },
            handler: context => this.trigger(context)
        });

        this.persistentEffect({
            targetType: 'player',
            targetController: 'current',
            condition: () => this.game.currentPhase === 'plot',
            effect: [
                ability.effects.cannotRevealPlot(plot => plot.hasTrait('Scheme')),
                ability.effects.groupCardPile('plot deck')
            ]
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

    onPlotDiscarded(event) {
        if(event.card.controller === this.controller && event.card.hasTrait('Scheme')) {
            this.owner.moveCard(event.card, 'out of game');
        }
    }
}

TheRainsOfCastamere.code = '05045';

module.exports = TheRainsOfCastamere;
