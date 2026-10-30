import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class VultureKing extends DrawCard {
    // Vulture King (25048)
    // Attached character gains pillage.
    // Reaction: After you win a challenge in which attached character is participating, discard the
    // top card of your deck to choose a character controlled by the losing opponent. Until the end
    // of the phase, that character loses a challenge icon of your choice.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('pillage')
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    !!context.source.parent &&
                    event.challenge.isParticipating(context.source.parent)
            },
            cost: ability.costs.discardFromDeck(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.event.challenge.loser
            },
            message:
                '{player} uses {source} and discards {costs.discardFromDeck} from their deck to have {target} lose a challenge icon until the end of the phase',
            gameAction: GameActions.chooseIcon({
                message:
                    '{player} chooses to have {target} lose {icon} icon until the end of the phase',
                gameAction: (icon) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.target,
                        effect: ability.effects.removeIcon(icon)
                    }))
            })
        });
    }
}

VultureKing.code = '25048';

export default VultureKing;
