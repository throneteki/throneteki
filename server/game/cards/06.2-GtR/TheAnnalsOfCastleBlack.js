import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TheAnnalsOfCastleBlack extends PlotCard {
    // The Annals of Castle Black (06040)
    // Each player may play events in his or her discard pile as if they were in his or her hand.
    // Forced Reaction: After an event is placed in a discard pile, remove it from the game.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.canPlayFromOwn('discard pile')
        });

        this.forcedReaction({
            when: {
                onCardPlaced: (event) =>
                    event.card.getType() === 'event' && event.location === 'discard pile'
            },
            message: {
                format: '{player} is forced by {source} to remove {card} from the game',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.removeFromGame((context) => ({ card: context.event.card }))
        });
    }
}

TheAnnalsOfCastleBlack.code = '06040';

export default TheAnnalsOfCastleBlack;
