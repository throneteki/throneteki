import EventPlayedTracker from '../../EventTrackers/EventPlayedTracker.js';
import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class TheMinstrelsMuse extends PlotCard {
    // The Minstrel's Muse (26020)
    // You cannot play more than 3 events this round.
    // Reaction: After a Song event is played, draw 1 card.
    setupCardAbilities(ability) {
        this.tracker = EventPlayedTracker.forRound(this.game);
        this.persistentEffect({
            match: (player, context) =>
                player === context.source.controller &&
                context.source.tracker.getNumberOfPlayedEvents(player) >= 3,
            targetController: 'any',
            effect: ability.effects.cannotPlay((card) => card.getType() === 'event')
        });

        this.reaction({
            when: {
                onCardPlayed: (event) => event.card.hasTrait('Song')
            },
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

TheMinstrelsMuse.code = '26020';

export default TheMinstrelsMuse;
