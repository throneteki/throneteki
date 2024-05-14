const PlotCard = require('../../plotcard.js');
const EventPlayedTracker = require('../../EventTrackers/EventPlayedTracker');

class TheAnnalsOfCastleBlack extends PlotCard {
    setupCardAbilities(ability) {
        this.tracker = EventPlayedTracker.forPhase(this.game);

        this.persistentEffect({
            targetController: 'any',
            match: (player) => this.tracker.getNumberOfPlayedEvents(player, 'discard pile') < 2,
            effect: ability.effects.canPlayFromOwn('discard pile')
        });

        this.forcedReaction({
            when: {
                onCardPlaced: (event) =>
                    event.card.getType() === 'event' && event.location === 'discard pile'
            },
            handler: (context) => {
                let eventCard = context.event.card;
                let player = eventCard.controller;

                this.game.addMessage(
                    '{0} is forced by {1} to remove {2} from the game',
                    player,
                    this,
                    eventCard
                );
                player.moveCard(eventCard, 'out of game');
            }
        });
    }
}

TheAnnalsOfCastleBlack.code = '17158';

module.exports = TheAnnalsOfCastleBlack;
