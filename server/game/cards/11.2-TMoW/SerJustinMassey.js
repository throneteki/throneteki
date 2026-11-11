import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class SerJustinMassey extends DrawCard {
    // Ser Justin Massey (11027)
    // While you control a King character, Ser Justin Massey gains renown.
    // Reaction: After a [baratheon] character gains power, stand it. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.controller.anyCardsInPlay(
                    (card) => card.hasTrait('King') && card.getType() === 'character'
                ),
            match: this,
            effect: ability.effects.addKeyword('renown')
        });
        this.reaction({
            when: {
                onCardPowerGained: (event) =>
                    event.card.isFaction('baratheon') &&
                    event.card.getType() === 'character' &&
                    event.card.kneeled
            },
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} uses {source} to stand {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.standCard((context) => ({ card: context.event.card }))
        });
    }
}

SerJustinMassey.code = '11027';

export default SerJustinMassey;
