import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Chett extends DrawCard {
    // Chett (02085)
    // No attachments except Weapon.
    // Dominance Action: Kneel a Steward character to return a Direwolf or Raven card from your
    // discard pile to your hand. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Return a card to hand',
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Steward') && card.getType() === 'character'
            ),
            phase: 'dominance',
            limit: ability.limit.perPhase(1),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller === context.source.controller &&
                    (card.hasTrait('Direwolf') || card.hasTrait('Raven'))
            },
            message:
                '{player} uses {source} to kneel {costs.kneel} to return {target} to their hand',
            gameAction: GameActions.addToHand((context) => ({ card: context.target }))
        });
    }
}

Chett.code = '02085';

export default Chett;
