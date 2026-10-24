import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class BericDondarrion extends DrawCard {
    // Beric Dondarrion (25001)
    // Renown.
    // Reaction: After you win a challenge in which Beric Dondarrion is attacking, choose a
    // character controlled by the losing opponent. Until the end of the round, that character
    // cannot kneel or stand. (Limit once per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isAttacking()
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.event.challenge.loser
            },
            limit: ability.limit.perRound(1),
            message:
                '{player} uses {source} to prevent {target} from standing or kneeling until the end of the round',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfRound',
                match: context.target,
                effect: [ability.effects.cannotBeStood(), ability.effects.cannotBeKneeled()]
            }))
        });
    }
}

BericDondarrion.code = '25001';

export default BericDondarrion;
