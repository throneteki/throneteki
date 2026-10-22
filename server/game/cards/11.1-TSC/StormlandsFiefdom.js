import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class StormlandsFiefdom extends DrawCard {
    // Stormlands Fiefdom (11009)
    // Action: Kneel Stormlands Fiefdom to move 1 power from a character or location to its owner's
    // faction card.
    // +1 Income.
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a power',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    (card.getType() === 'character' || card.getType() === 'location') &&
                    card.getPower() > 0
            },
            message:
                "{player} kneels {source} to move 1 power from {target} to its owner's faction card",
            gameAction: GameActions.movePower((context) => ({
                from: context.target,
                to: context.target.owner.faction,
                amount: 1
            }))
        });

        this.plotModifiers({
            gold: 1
        });
    }
}

StormlandsFiefdom.code = '11009';

export default StormlandsFiefdom;
