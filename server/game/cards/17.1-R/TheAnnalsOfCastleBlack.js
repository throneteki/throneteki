import PlotCard from '../../plotcard.js';
import EventPlayedTracker from '../../EventTrackers/EventPlayedTracker.js';
import GameActions from '../../GameActions/index.js';

class TheAnnalsOfCastleBlack extends PlotCard {
    // The Annals of Castle Black (17158)
    // Twice per phase, each player may play an event in their discard pile as if it were in their
    // hand.
    // Forced Reaction: After an event is placed in a discard pile, remove it from the game.
    setupCardAbilities(ability) {
        const tracker = EventPlayedTracker.forPhase(this.game);

        this.persistentEffect({
            targetController: 'any',
            match: (player) => tracker.getNumberOfPlayedEvents(player, 'discard pile') < 2,
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

TheAnnalsOfCastleBlack.code = '17158';

export default TheAnnalsOfCastleBlack;
