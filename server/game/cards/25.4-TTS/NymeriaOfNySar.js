import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Flags } from '../../Constants/index.js';

class NymeriaOfNySar extends DrawCard {
    // Nymeria of Ny Sar (25068)
    // Unique [martell] location you control only.
    // Reaction: After you win a challenge by 5 or more STR, kneel Nymeria of Ny Sar to reveal a
    // [martell] or Summer plot.
    setupCardAbilities(ability) {
        this.attachmentRestriction({
            type: 'location',
            faction: 'martell',
            controller: 'current',
            unique: true
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.strengthDifference >= 5 &&
                    !context.player.hasFlag(Flags.player.cannotRevealPlot)
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
            message: '{player} kneels {source} to reveal {target}',
            gameAction: GameActions.revealNewPlot((context) => ({
                card: context.target,
                player: context.player
            }))
        });
    }
}

NymeriaOfNySar.code = '25068';

export default NymeriaOfNySar;
