import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NymellaToland extends DrawCard {
    // Nymella Toland (27007)
    // Action: Choose a character that is attacking or defending alone, and remove it from the
    // challenge. (Limit once per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove character from challenge',
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    condition: (card) =>
                        this.game.isDuringChallenge({
                            or: [{ attackingAlone: card }, { defendingAlone: card }]
                        })
                }
            },
            limit: ability.limit.perRound(1),
            message: '{player} uses {source} to remove {target} from the challenge',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.removeFromChallenge((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

NymellaToland.code = '27007';

export default NymellaToland;
