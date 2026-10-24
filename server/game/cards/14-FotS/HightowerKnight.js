import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HightowerKnight extends DrawCard {
    // Hightower Knight (14037)
    // Action: Kneel a non-[tyrell] Knight character to put Hightower Knight into play from your
    // hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into play',
            location: 'hand',
            condition: (context) => context.source.controller.canPutIntoPlay(context.source),
            cost: ability.costs.kneel(
                (card) =>
                    card.getType() === 'character' &&
                    !card.isFaction('tyrell') &&
                    card.hasTrait('Knight')
            ),
            message: {
                format: '{player} uses {source} and kneels {kneeledCard} to put {source} into play',
                args: { kneeledCard: (context) => context.costs.kneel }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            }))
        });
    }
}

HightowerKnight.code = '14037';

export default HightowerKnight;
