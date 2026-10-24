import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SmallfolkMob extends DrawCard {
    // Smallfolk Mob (13081)
    // Shadow (4).
    // Action: Sacrifice a unique [stark] character to put Smallfolk Mob into play from shadows.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into play',
            location: 'shadows',
            condition: (context) => context.player.canPutIntoPlay(context.source, 'outOfShadows'),
            cost: ability.costs.sacrifice((card) =>
                card.isMatch({ type: 'character', faction: 'stark', unique: true })
            ),
            message: {
                format: '{player} sacrifices {sacrificedCard} to put {source} into play from shadows',
                args: { sacrificedCard: (context) => context.costs.sacrifice }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source,
                playingType: 'outOfShadows'
            }))
        });
    }
}

SmallfolkMob.code = '13081';

export default SmallfolkMob;
