import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerArysOakheart extends DrawCard {
    // Ser Arys Oakheart (04115)
    // No attachments except Weapon.
    // Reaction: After Ser Arys Oakheart enters play, pay 2 gold to choose an Ally character, and
    // discard it from play.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            cost: ability.costs.payGold(2),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('Ally') &&
                    card.getType() === 'character'
            },
            message: '{player} uses {source} and pays 2 gold to discard {target} from play',
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
        });
    }
}

SerArysOakheart.code = '04115';

export default SerArysOakheart;
