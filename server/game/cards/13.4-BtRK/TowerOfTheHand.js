import DrawCard from '../../drawcard.js';

class TowerOfTheHand extends DrawCard {
    // Tower of the Hand (13062)
    // Reaction: After a card you control comes out of shadows, if there is a Winter plot card
    // revealed, choose and stand a [stark] character. (Limit once per phase.)
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
