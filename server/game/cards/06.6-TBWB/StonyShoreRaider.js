import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class StonyShoreRaider extends DrawCard {
    // Stony Shore Raider (06111)
    // Bestow (3).
    // Action: Discard 1 gold from Stony Shore Raider to choose and kneel a location with printed
    // cost 3 or lower. (Limit once per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel location',
            cost: ability.costs.discardGold(),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'location' &&
                    card.getPrintedCost() <= 3 &&
                    !card.kneeled
            },
            limit: ability.limit.perRound(1),
            message: '{player} discards 1 gold from {source} to kneel {target}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.target }))
        });
    }
}

StonyShoreRaider.code = '06111';

export default StonyShoreRaider;
