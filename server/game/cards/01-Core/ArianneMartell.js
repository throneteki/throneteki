import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ArianneMartell extends DrawCard {
    // Arianne Martell (01104)
    // Action: Put a character with printed cost 5 or lower into play from your hand. Then, return
    // Arianne Martell to your hand (cannot be saved). (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character into play',
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.source.controller &&
                    card.getPrintedCost() <= 5 &&
                    card.getType() === 'character' &&
                    context.source.controller.canPutIntoPlay(card)
            },
            message: '{player} uses {source} to put {target} into play',
            gameAction: GameActions.putIntoPlay((context) => ({
                card: context.target
            })).then((context) => ({
                message: 'Then {player} returns {source} to hand',
                gameAction: GameActions.returnCardToHand((context) => ({
                    card: context.source,
                    allowSave: false
                }))
            }))
        });
    }
}

ArianneMartell.code = '01104';

export default ArianneMartell;
