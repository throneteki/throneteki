import DrawCard from '../../drawcard.js';

class SerAddamMarbrand extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.controller === this.controller &&
                    (event.card.hasTrait('Knight') || event.card.hasTrait('Army'))
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.modifyGold(1);
                this.game.addMessage('{0} uses {1} to have {1} gain 1 gold', this.controller, this);
            }
        });
        this.reaction({
            when: {
                onCardPlaced: (event) =>
                    event.card.getType() === 'character' &&
                    event.card.owner === this.controller &&
                    event.card.location === 'discard pile'
            },
            limit: ability.limit.perRound(2),
            cost: ability.costs.discardGold(),
            handler: (context) => {
                let discardedCard = context.event.card;
                discardedCard.owner.moveCard(discardedCard, 'hand');
                this.game.addMessage(
                    '{0} uses {1} to move {2} from their discard pile to their hand',
                    this.controller,
                    this,
                    discardedCard
                );
            }
        });
    }
}

SerAddamMarbrand.code = '18005';

export default SerAddamMarbrand;
