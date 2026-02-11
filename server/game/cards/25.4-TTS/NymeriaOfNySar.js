import DrawCard from '../../drawcard.js';
import RevealPlots from '../../gamesteps/revealplots.js';
import { Flags } from '../../Constants/index.js';

class NymeriaOfNySar extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({
            type: 'location',
            faction: 'martell',
            controller: 'current',
            unique: true
        });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    !this.controller.hasFlag(Flags.player.cannotRevealPlot)
            },
            cost: ability.costs.kneelSelf(),
            target: {
                type: 'select',
                activePromptTitle: 'Select a plot',
                cardCondition: (card, context) =>
                    card.controller === context.player &&
                    card.location === 'plot deck' &&
                    (card.hasTrait('Summer') || card.isFaction('martell')),
                cardType: 'plot'
            },
            message: '{player} uses {source} and kneels their faction card to reveal {target}',
            handler: (context) => this.trigger(context)
        });

        this.action({
            title: 'Manually trigger',
            cost: ability.costs.kneelSelf(),
            condition: () => !this.controller.hasFlag(Flags.player.cannotRevealPlot),
            target: {
                type: 'select',
                activePromptTitle: 'Select a plot',
                cardCondition: (card, context) =>
                    card.controller === context.player &&
                    card.location === 'plot deck' &&
                    (card.hasTrait('Summer') || card.isFaction('martell')),
                cardType: 'plot'
            },
            handler: (context) => this.trigger(context)
        });
    }

    trigger(context) {
        context.player.selectedPlot = context.target;
        this.game.queueStep(new RevealPlots(this.game, [context.target]));
    }
}

NymeriaOfNySar.code = '25068';

export default NymeriaOfNySar;
