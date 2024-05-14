import DrawCard from '../../drawcard.js';

class RenlyBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character into play',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) =>
                    card.controller === this.controller &&
                    card.location === 'hand' &&
                    card.getType() === 'character' &&
                    !card.isFaction('baratheon') &&
                    card.getPrintedCost() <= this.getStrength() &&
                    this.controller.canPutIntoPlay(card)
            },
            message:
                '{player} uses {source} and kneels their faction card to put {target} into play',
            handler: (context) => {
                context.player.putIntoPlay(context.target);
            }
        });
    }
}

RenlyBaratheon.code = '14004';

export default RenlyBaratheon;
