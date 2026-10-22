import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LordsportShipright extends DrawCard {
    // Lordsport Shipwright (01075)
    // Marshaling Action: Kneel Lordsport Shipwright to choose and kneel a location with printed
    // cost 2 or lower. (Printed cost 3 or lower instead if you are the first player.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a location',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card, context) => context.source.cardCondition(card)
            },
            message: '{player} uses {source} to kneel {target}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.target }))
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
