import DrawCard from '../../drawcard.js';

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
                cardCondition: (card) => this.cardCondition(card)
            },
            handler: (context) => {
                let oldLocation = context.target.location;

                this.controller.moveCard(context.target, 'hand');
                this.game.addMessage(
                    '{0} uses {1} to move {2} from their {3} to their hand',
                    this.controller,
                    this,
                    context.target,
                    oldLocation
                );
            }
        });
    }

    cardCondition(card) {
        return (
            (card.location === 'dead pile' || card.location === 'discard pile') &&
            card.controller === this.controller &&
            card.getType() === 'character' &&
            card.isFaction('stark') &&
            card.getPrintedStrength() <= 2
        );
    }
}

Summer.code = '01148';

export default Summer;
