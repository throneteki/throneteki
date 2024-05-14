import DrawCard from '../../drawcard.js';

class TowerOfTheHand extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) =>
                    event.card.controller === this.controller && this.game.anyPlotHasTrait('Winter')
            },
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isFaction('stark') &&
                    card.kneeled,
                gameAction: 'stand'
            },
            message: '{player} kneels {source} to stand {target}',
            handler: (context) => {
                context.player.standCard(context.target);
            }
        });
    }
}

TowerOfTheHand.code = '13062';

export default TowerOfTheHand;
