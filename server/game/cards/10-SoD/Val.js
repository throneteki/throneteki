import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Val extends DrawCard {
    // Val (10039)
    // Reaction: After Val is declared as an attacker, put a Wildling character with printed cost 4
    // or lower into play from your hand knelt, participating as an attacker.
    setupCardAbilities() {
        this.reaction({
            when: {
                onDeclaredAsAttacker: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.player &&
                    card.getType() === 'character' &&
                    card.hasTrait('Wildling') &&
                    card.getPrintedCost() <= 4
            },
            message:
                '{player} uses {source} to put {target} into play from their hand knelt, participating as an attacker',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target,
                kneeled: true
            })).then({
                gameAction: GameActions.addToChallenge((context) => ({
                    card: context.parentContext.target,
                    player: context.player
                }))
            })
        });
    }
}

Val.code = '10039';

export default Val;
