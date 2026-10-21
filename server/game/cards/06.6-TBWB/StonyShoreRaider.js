import DrawCard from '../../drawcard.js';

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
            handler: (context) => {
                context.target.controller.kneelCard(context.target);
                this.game.addMessage(
                    '{0} discards 1 gold from {1} to kneel {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

StonyShoreRaider.code = '06111';

export default StonyShoreRaider;
