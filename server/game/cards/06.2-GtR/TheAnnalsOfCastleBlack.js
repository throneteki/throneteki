import PlotCard from '../../plotcard.js';

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

TheAnnalsOfCastleBlack.code = '06040';

export default TheAnnalsOfCastleBlack;
