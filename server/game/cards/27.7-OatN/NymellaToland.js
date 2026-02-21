import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NymellaToland extends DrawCard {
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

NymellaToland.code = '27538';
NymellaToland.version = '1.0.0';

export default NymellaToland;
