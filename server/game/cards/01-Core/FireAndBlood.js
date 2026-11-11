import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FireAndBlood extends DrawCard {
    // Fire and Blood (01177)
    // Challenges Action: Choose a unique [targaryen] character in your dead pile, and shuffle it
    // back into your deck. If that character is a Hatchling, you may put it into play instead.
    setupCardAbilities() {
        this.action({
            title: 'Shuffle card from dead pile back into deck',
            phase: 'challenge',
            target: {
                cardCondition: (card, context) =>
                    card.controller === context.player &&
                    card.location === 'dead pile' &&
                    card.isUnique() &&
                    card.isFaction('targaryen')
            },
            gameAction: GameActions.ifCondition({
                condition: (context) =>
                    context.target.hasTrait('Hatchling') &&
                    context.player.canPutIntoPlay(context.target),
                thenAction: GameActions.choose({
                    title: 'Put card into play?',
                    choices: {
                        Yes: {
                            message:
                                '{player} plays {source} to remove {target} from their dead pile and put it into play',
                            gameAction: GameActions.putIntoPlay((context) => ({
                                player: context.player,
                                card: context.target
                            }))
                        },
                        No: shuffleIntoDeck()
                    }
                }),
                elseAction: shuffleIntoDeck()
            })
        });
    }
}

function shuffleIntoDeck() {
    return {
        message:
            '{player} plays {source} to remove {target} from their dead pile and shuffle it into their deck',
        gameAction: GameActions.shuffleIntoDeck((context) => ({ cards: [context.target] }))
    };
}

FireAndBlood.code = '01177';

export default FireAndBlood;
