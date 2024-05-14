import DrawCard from '../../drawcard.js';

class TomOfSevenstreams extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event) =>
                    event.card.hasTrait('Song') && event.card.controller === this.controller
            },
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.controller &&
                    !card.isLoyal() &&
                    card.kneeled,
                gameAction: 'stand'
            },
            handler: (context) => {
                context.target.controller.standCard(context.target);
                this.game.addMessage(
                    '{0} uses {1} to stand {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

TomOfSevenstreams.code = '08057';

export default TomOfSevenstreams;
