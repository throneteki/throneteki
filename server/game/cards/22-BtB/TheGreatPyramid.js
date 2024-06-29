import DrawCard from '../../drawcard.js';
import GenericTracker from '../../EventTrackers/GenericTracker.js';
import GameActions from '../../GameActions/index.js';

class TheGreatPyramid extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents([{ 'onCardLeftPlay:forcedinterrupt': 'onCardLeftPlay' }]);
    }
    setupCardAbilities(ability) {
        this.marshalledTracker = GenericTracker.forRound(this.game, 'onCardMarshalled');
        this.playedTracker = GenericTracker.forRound(this.game, 'onCardPlayed');

        this.persistentEffect({
            targetController: 'current',
            effect: [
                ability.effects.canMarshal((card) => this.canMarshalOrPlay(card)),
                ability.effects.canMarshalIntoShadows((card) => this.canMarshalOrPlay(card)),
                ability.effects.canPlay((card) => this.canMarshalOrPlay(card))
            ]
        });

        this.reaction({
            when: {
                'onCardDiscarded:aggregate': (event) =>
                    event.events.some(
                        (discardEvent) =>
                            discardEvent.cardStateWhenDiscarded.controller === this.controller &&
                            discardEvent.cardStateWhenDiscarded.location === 'hand' &&
                            discardEvent.card.location === 'discard pile'
                    )
            },
            limit: ability.limit.perRound(2),
            message: {
                format: '{player} uses {source} to place {cards} facedown under {source}',
                args: { cards: (context) => context.events.map((event) => event.card) }
            },
            gameAction: GameActions.simultaneously((context) =>
                context.events.map((event) =>
                    GameActions.placeCardUnderneath({
                        card: event.card,
                        parentCard: this,
                        facedown: true
                    })
                )
            )
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
        let predicate = (event) =>
            event.originalLocation === 'underneath' &&
            event.originalParent.getType() === 'location' &&
            event.originalParent.hasTrait('Meereen') &&
            (event.originalController === this.controller || event.player === this.controller);

        let marshalledCount = this.marshalledTracker.count(predicate);
        let playedCount = this.playedTracker.count(predicate);
        return marshalledCount + playedCount >= 2;
    }

    onCardLeftPlay(event) {
        if (event.card !== this || this.underneath.length === 0) {
            return;
        }

        this.game.resolveGameAction(
            GameActions.simultaneously(
                ...this.underneath.map((card) => GameActions.removeFromGame({ card }))
            )
        );

        this.game.addMessage(
            '{0} removes {1} from the game due to {2} leaving play',
            this.controller,
            this.underneath,
            this
        );
    }
}

TheGreatPyramid.code = '22021';

export default TheGreatPyramid;
