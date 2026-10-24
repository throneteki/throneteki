import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CerseisInformer extends DrawCard {
    // Cersei's Informer (08089)
    // Bestow (3).
    // Action: Move 1 gold from Cersei's Informer to a non-Spy card you control to draw 1 card.
    // Then, choose and discard 1 card from your hand. (Limit once per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw card',
            limit: ability.limit.perRound(1),
            cost: ability.costs.moveTokenFromSelf(
                'gold',
                1,
                (card, context) =>
                    !card.hasTrait('Spy') &&
                    card.location === 'play area' &&
                    card.controller === context.player
            ),
            message:
                '{player} moves 1 gold from {source} to {costs.moveTokenFromSelf} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: 1
            })).then({
                gameAction: GameActions.chooseCards({
                    title: 'Select a card to discard',
                    cardCondition: (card, context) =>
                        card.location === 'hand' && card.controller === context.player,
                    gameAction: (card) => GameActions.discardCard({ card })
                })
            })
        });
    }
}

CerseisInformer.code = '08089';

export default CerseisInformer;
