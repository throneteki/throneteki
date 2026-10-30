import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OrphanOfTheGreenblood extends DrawCard {
    // Orphan of the Greenblood (06035)
    // Bestow (3).
    // Action: Discard 1 gold from Orphan of the Greenblood to return another character you control
    // to its owner's hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard 1 gold from ' + this.name,
            cost: ability.costs.discardGold(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.source.controller &&
                    card !== context.source &&
                    card.getType() === 'character'
            },
            message: '{player} discards 1 gold from {source} to return {target} to their hand',
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

OrphanOfTheGreenblood.code = '06035';

export default OrphanOfTheGreenblood;
