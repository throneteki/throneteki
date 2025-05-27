import EventPlayedTracker from '../../EventTrackers/EventPlayedTracker.js';
import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class TheMinstrelsMuse extends PlotCard {
    setupCardAbilities(ability) {
        this.tracker = EventPlayedTracker.forPhase(this.game);
        this.persistentEffect({
            condition: () => true,
            match: (player) =>
                player === this.controller && this.tracker.getNumberOfPlayedEvents(player) >= 3,
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
