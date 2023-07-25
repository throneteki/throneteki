const DrawCard = require('../../drawcard.js');
const RevealPlots = require('../../gamesteps/revealplots');
const SimpleStep = require('../../gamesteps/simplestep.js');

class NymeriaOfNySar extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location', unique: true });
        this.reaction({
            cannotBeCanceled: true,
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.strengthDifference >= 10 && !this.controller.hasFlag('cannotRevealPlot')
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                type: 'select',
                activePromptTitle: 'Select a plot',
                cardCondition: (card, context) => 
                    card.controller === context.player && 
                    card.location === 'plot deck' && 
                    (card.hasTrait('Summer') || card.hasTrait('Scheme')),
                cardType: 'plot'
            },
            message: '{player} uses {source} and kneels their faction card to reveal {target}',
            handler: context => this.trigger(context)
        });

        this.action({
            title: 'Manually trigger',
            cost: ability.costs.kneelFactionCard(),
            condition: () => !this.controller.hasFlag('cannotRevealPlot'),
            target: {
                type: 'select',
                activePromptTitle: 'Select a plot',
                cardCondition: (card, context) => 
                    card.controller === context.player && 
                    card.location === 'plot deck' && 
                    (card.hasTrait('Summer') || card.hasTrait('Scheme')),
                cardType: 'plot'
            },
            handler: context => this.trigger(context)
        });
    }

    trigger(context) {
        context.player.selectedPlot = context.target;
        this.game.queueStep(new RevealPlots(this.game, [context.target]));
        this.game.queueStep(new SimpleStep(this.game, () => {
            context.player.recyclePlots();
        }));
    }
}

NymeriaOfNySar.code = '25545';
NymeriaOfNySar.version = '1.0';

module.exports = NymeriaOfNySar;
