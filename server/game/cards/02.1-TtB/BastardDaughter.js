import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BastardDaughter extends DrawCard {
    // Bastard Daughter (02015)
    // Interrupt: When Bastard Daughter or The Red Viper is killed, discard 1 card at random from
    // each opponent's hand.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, context) =>
                    event.card === context.source || event.card.name === 'The Red Viper'
            },
            message: "{player} uses {source} to discard 1 card at random from each opponent's hand",
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .getOpponents(context.player)
                    .map((player) => GameActions.discardAtRandom({ player, amount: 1 }))
            )
        });
    }
}

BastardDaughter.code = '02015';

export default BastardDaughter;
