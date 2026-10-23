import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheFaithsDecree extends DrawCard {
    // The Faith's Decree (13059)
    // Play only if you control a The Seven character or location.
    // Action: Name a non-agenda, non-plot card. Until the end of the phase, each opponent cannot
    // trigger card abilities of cards with that name.
    setupCardAbilities(ability) {
        this.action({
            title: 'Prevent abilities',
            condition: (context) =>
                context.player.anyCardsInPlay({
                    type: ['character', 'location'],
                    trait: 'The Seven'
                }),
            message: '{player} plays {source} to name a card',
            gameAction: GameActions.nameCard({
                match: (cardData) => !['agenda', 'plot'].includes(cardData.type),
                message:
                    '{player} names {cardName} to prevent opponents from triggering its abilities',
                gameAction: GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    targetController: 'opponent',
                    effect: ability.effects.cannotTriggerCardAbilities(
                        (triggered) =>
                            triggered.card.name.toLowerCase() === context.namedCard.toLowerCase()
                    )
                }))
            })
        });
    }
}

TheFaithsDecree.code = '13059';

export default TheFaithsDecree;
