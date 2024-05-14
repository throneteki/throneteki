import DrawCard from '../../drawcard.js';

class DrownedDisciple extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.getType() === 'character' &&
                    event.card.controller === this.controller &&
                    event.originalLocation === 'dead pile'
            },
            max: ability.limit.perPhase(2),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('Drowned God') &&
                    card.getType() === 'character',
                gameAction: 'gainPower'
            },
            handler: (context) => {
                context.target.modifyPower(1);
                this.game.addMessage(
                    '{0} uses {1} to have {2} gain 1 power',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

DrownedDisciple.code = '17105';

export default DrownedDisciple;
