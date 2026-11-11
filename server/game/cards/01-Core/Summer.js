import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Summer extends DrawCard {
    // Summer (01148)
    // No attachments.
    // While you control Bran Stark, he gains insight.
    // Reaction: After Summer enters play, return a [stark] character with printed STR 2 or lower
    // from your discard or dead pile to your hand.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Bran Stark',
            effect: ability.effects.addKeyword('Insight')
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
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
