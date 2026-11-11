import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OverthrowingTheMasters extends DrawCard {
    // Overthrowing the Masters (06094)
    // Action: During a challenge in which you are the attacking player, choose a defending
    // character with X STR or lower and remove it from the challenge. X is the number of characters
    // in the defending player's dead pile.
    setupCardAbilities() {
        this.action({
            title: 'Remove character from challenge',
            condition: (context) =>
                context.game.isDuringChallenge({ attackingPlayer: context.source.controller }),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isDefending() &&
                    card.getStrength() <=
                        context.game.currentChallenge.defendingPlayer.deadPile.length
            },
            message: '{player} plays {source} to remove {target} from the challenge',
            gameAction: GameActions.removeFromChallenge((context) => ({ card: context.target }))
        });
    }
}

OverthrowingTheMasters.code = '06094';

export default OverthrowingTheMasters;
