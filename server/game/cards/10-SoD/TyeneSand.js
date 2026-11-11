import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TyeneSand extends DrawCard {
    // Tyene Sand (10008)
    // Stealth.
    // Reaction: After you lose a challenge as the defending player, kneel a Sand Snake character to
    // put Tyene Sand into play from your hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    event.challenge.defendingPlayer === context.source.controller &&
                    context.source.controller.canPutIntoPlay(context.source)
            },
            location: 'hand',
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Sand Snake') && card.getType() === 'character'
            ),
            message: '{player} kneels {costs.kneel} to put {source} into play from their hand',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            }))
        });
    }
}

TyeneSand.code = '10008';

export default TyeneSand;
