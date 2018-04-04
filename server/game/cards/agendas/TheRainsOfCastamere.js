const AgendaCard = require('../../agendacard');
const RevealPlots = require('../../gamesteps/revealplots');

class TheRainsOfCastamere extends AgendaCard {
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
            effect: [
                ability.effects.cannotSelectSchemes(),
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
}

TheRainsOfCastamere.code = '05045';

module.exports = TheRainsOfCastamere;
