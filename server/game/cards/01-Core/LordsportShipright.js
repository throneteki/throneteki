import DrawCard from '../../drawcard.js';

class LordsportShipright extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a location',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) => this.cardCondition(card)
            },
            handler: (context) => {
                context.player.kneelCard(context.target);

                this.game.addMessage(
                    '{0} uses {1} to kneel {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }

    cardCondition(card) {
        let cost = this.controller.firstPlayer ? 3 : 2;

        return (
            !card.kneeled &&
            card.getType() === 'location' &&
            card.getPrintedCost() <= cost &&
            card.location === 'play area'
        );
    }
}

LordsportShipright.code = '01075';

export default LordsportShipright;
