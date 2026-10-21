import DrawCard from '../../drawcard.js';

class BlackwaterRush extends DrawCard {
    // Blackwater Rush (13088)
    // Shadow (2).
    // Reaction: After a card you control comes out of shadows, kneel Blackwater Rush to choose a
    // [baratheon] character. That character gains 1 power.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card.controller === this.controller
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isFaction('baratheon') &&
                    card.canGainPower()
            },
            handler: (context) => {
                context.target.modifyPower(1);

                this.game.addMessage(
                    '{0} kneels {1} to have {2} gain one power.',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

BlackwaterRush.code = '13088';

export default BlackwaterRush;
