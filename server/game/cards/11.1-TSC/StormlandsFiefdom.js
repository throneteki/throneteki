import DrawCard from '../../drawcard.js';

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
            handler: (context) => {
                this.game.movePower(context.target, context.target.owner.faction, 1);

                this.game.addMessage(
                    "{0} kneels {1} to move 1 power from {2} to its owner's faction card",
                    this.controller,
                    this,
                    context.target
                );
            }
        });

        this.plotModifiers({
            gold: 1
        });
    }
}

StormlandsFiefdom.code = '11009';

export default StormlandsFiefdom;
