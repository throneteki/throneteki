import DrawCard from '../../drawcard.js';

class SerArysOakheart extends DrawCard {
    // Ser Arys Oakheart (04115)
    // No attachments except Weapon.
    // Reaction: After Ser Arys Oakheart enters play, pay 2 gold to choose an Ally character, and
    // discard it from play.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            cost: ability.costs.payGold(2),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('Ally') &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                context.target.controller.discardCard(context.target);
                this.game.addMessage(
                    '{0} uses {1} and pays 2 gold to discard {2} from play',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

SerArysOakheart.code = '04115';

export default SerArysOakheart;
