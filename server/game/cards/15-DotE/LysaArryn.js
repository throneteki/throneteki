import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LysaArryn extends DrawCard {
    // Lysa Arryn (15039)
    // Interrupt: When Lysa Arryn is killed, choose another character, location, or attachment and
    // remove it from the game.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card !== context.source &&
                    ['character', 'attachment', 'location'].includes(card.getType())
            },
            message: '{player} uses {source} to remove {target} from the game',
            gameAction: GameActions.removeFromGame((context) => ({ card: context.target }))
        });
    }
}

LysaArryn.code = '15039';

export default LysaArryn;
