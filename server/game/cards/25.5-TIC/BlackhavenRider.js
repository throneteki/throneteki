import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BlackhavenRider extends DrawCard {
    // Blackhaven Rider (25081)
    // Reaction: After Blackhaven Rider enters play, each player must choose and kneel a loyal
    // character they control, if able.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'character' &&
                    card.isLoyal(),
                gameAction: 'kneel'
            },
            message: '{player} uses {source} to have each player kneel {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.targets.getTargets().map((card) => GameActions.kneelCard({ card }))
            )
        });
    }
}

BlackhavenRider.code = '25081';

export default BlackhavenRider;
