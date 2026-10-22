import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NymeriasGuard extends DrawCard {
    // Nymeria's Guard (10009)
    // No attachments.
    // Challenges Action: Pay 4 gold and stand a Sand Snake character to put Nymeria's Guard into
    // play from your hand.
    setupCardAbilities(ability) {
        this.action({
            title: "Put Nymeria's Guard into play",
            location: 'hand',
            phase: 'challenge',
            condition: (context) => context.source.controller.canPutIntoPlay(context.source),
            cost: [
                ability.costs.payGold(4),
                ability.costs.stand(
                    (card) => card.hasTrait('Sand Snake') && card.getType() === 'character'
                )
            ],
            message: '{player} pays 4 gold and stands {costs.stand} to put {source} into play',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            }))
        });
    }
}

NymeriasGuard.code = '10009';

export default NymeriasGuard;
