import DrawCard from '../../drawcard.js';
import GenericTracker from '../../EventTrackers/GenericTracker.js';
import GameActions from '../../GameActions/index.js';

const placedCards = (context) =>
    context.events
        .map((event) => event.card)
        .filter((card) => context.source.underneath.includes(card));

class TheGreatPyramid extends DrawCard {
    // The Great Pyramid (22021)
    // Twice per round, you may marshal or play a facedown card under a Meereen location you control
    // as if it were in your hand.
    // Reaction: After 1 or more cards are discarded from your hand, place them facedown under The
    // Great Pyramid. If The Great Pyramid leaves play, remove each card you placed under it from
    // the game. (Limit twice per round.)
    setupCardAbilities(ability) {
        this.marshalledTracker = GenericTracker.forRound(this.game, 'onCardMarshalled');
        this.playedTracker = GenericTracker.forRound(this.game, 'onCardPlayed');

        this.persistentEffect({
            targetController: 'current',
            effect: [
                ability.effects.canMarshal((card, context) =>
                    context.source.canMarshalOrPlay(card)
                ),
                ability.effects.canMarshalIntoShadows((card, context) =>
                    context.source.canMarshalOrPlay(card)
                ),
                ability.effects.canPlay((card, context) => context.source.canMarshalOrPlay(card))
            ]
        });

        this.reaction({
            when: {
                onCardDiscarded: {
                    aggregateBy: (event) => ({
                        controller: event.cardStateWhenDiscarded.controller,
                        location: event.cardStateWhenDiscarded.location
                    }),
                    condition: (aggregate, events, context) =>
                        aggregate.controller === context.player && aggregate.location === 'hand'
                }
            },
            limit: ability.limit.perRound(2),
            message: {
                format: '{player} uses {source} to place {cards} facedown under {source}',
                args: { cards: (context) => context.events.map((event) => event.card) }
            },
            gameAction: GameActions.simultaneously([
                GameActions.simultaneously((context) =>
                    context.events.map((event) =>
                        GameActions.placeCardUnderneath({
                            card: event.card,
                            parentCard: context.source,
                            facedown: true
                        })
                    )
                ),
                GameActions.delayedEffect({
                    duration: 'untilTriggered',
                    when: {
                        onCardLeftPlay: (event, context) => event.card === context.source
                    },
                    message: {
                        format: '{player} removes {cards} from the game as {source} left play',
                        args: { cards: (context) => placedCards(context) }
                    },
                    gameAction: GameActions.simultaneously((context) =>
                        placedCards(context).map((card) => GameActions.removeFromGame({ card }))
                    )
                })
            ])
        });
    }

    canMarshalOrPlay(card) {
        return (
            card.location === 'underneath' &&
            card.facedown &&
            card.parent &&
            card.parent.getType() === 'location' &&
            card.parent.hasTrait('Meereen') &&
            !this.hasReachedMarshalOrPlayLimit()
        );
    }

    hasReachedMarshalOrPlayLimit() {
        const controller = this.controller;
        let predicate = (event) =>
            event.originalLocation === 'underneath' &&
            event.originalParent.getType() === 'location' &&
            event.originalParent.hasTrait('Meereen') &&
            (event.originalController === controller || event.player === controller);

        let marshalledCount = this.marshalledTracker.count(predicate);
        let playedCount = this.playedTracker.count(predicate);
        return marshalledCount + playedCount >= 2;
    }
}

TheGreatPyramid.code = '22021';

export default TheGreatPyramid;
