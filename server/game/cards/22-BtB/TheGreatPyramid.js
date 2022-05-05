const DrawCard = require('../../drawcard.js');
const GenericTracker = require('../../EventTrackers/GenericTracker');
const GameActions = require('../../GameActions');

class TheGreatPyramid extends DrawCard {
    setupCardAbilities(ability) {
        this.marshalledTracker = GenericTracker.forRound(this.game, 'onCardMarshalled');
        this.playedTracker = GenericTracker.forRound(this.game, 'onCardPlayed');

        this.persistentEffect({
            targetController: 'current',
            effect: [
                ability.effects.canMarshal(card => this.canMarshalOrPlay(card)),
                ability.effects.canMarshalIntoShadows(card => this.canMarshalOrPlay(card)),
                ability.effects.canPlay(card => this.canMarshalOrPlay(card))
            ]
        });

        this.reaction({
            when: {
                'onCardDiscarded:aggregate': event => (
                    event.events.some(discardEvent => (
                        discardEvent.cardStateWhenDiscarded.controller === this.controller &&
                        discardEvent.cardStateWhenDiscarded.location === 'hand' &&
                        discardEvent.card.location === 'discard pile'
                    ))
                )
            },
            limit: ability.limit.perRound(2),
            handler: context => {
                let discardedCards = context.event.events.map(discardEvent => discardEvent.card).filter(card => card.location === 'discard pile');
                this.game.addMessage('{0} places {1} under {2}', context.player, discardedCards, this);

                this.lastingEffect(ability => ({
                    until: {
                        onCardLeftPlay: event => event.card === this
                    },
                    targetLocation: 'any',
                    match: discardedCards,
                    effect: ability.effects.placeCardUnderneath(this.removeCardsUnderneathFromGame)
                }));
            }
        });
    }

    canMarshalOrPlay(card) {
        return card.location === 'underneath' 
            && card.facedown 
            && card.parent 
            && card.parent.getType() === 'location' 
            && card.parent.hasTrait('Meereen') 
            && !this.hasReachedMarshalOrPlayLimit();
    }

    hasReachedMarshalOrPlayLimit() {
        let predicate = event => event.originalLocation === 'underneath' && 
            event.originalParent.getType() === 'location' &&
            event.originalParent.hasTrait('Meereen') && 
            (event.originalController === this.controller || event.player === this.controller);

        let marshalledCount = this.marshalledTracker.count(predicate);
        let playedCount = this.playedTracker.count(predicate);
        return marshalledCount + playedCount >= 2;
    }

    removeCardsUnderneathFromGame(card, context) {
        if(card.location === 'underneath' && context.source.childCards.some(childCard => childCard === card)) {
            context.game.resolveGameAction(GameActions.removeFromGame({ card, player: this }));

            context.game.addMessage('{0} removes {1} from the game from under {2}',
                context.source.controller, card, context.source);
        }
    }
}

TheGreatPyramid.code = '22021';

module.exports = TheGreatPyramid;
