import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Summer extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Bran Stark',
            effect: ability.effects.addKeyword('Insight')
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                cardCondition: (card, context) =>
                    ['dead pile', 'discard pile'].includes(card.location) &&
                    card.controller === context.player &&
                    card.getType() === 'character' &&
                    card.isFaction('stark') &&
                    card.getPrintedStrength() <= 2
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

Summer.code = '01148';

export default Summer;
