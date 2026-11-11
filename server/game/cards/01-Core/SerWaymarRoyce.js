import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerWaymarRoyce extends DrawCard {
    // Ser Waymar Royce (01128)
    // No attachments except Weapon.
    // Interrupt: When Ser Waymar Royce is killed, discard 1 card at random from each opponent's
    // hand.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, context) => event.card === context.source
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

SerWaymarRoyce.code = '01128';

export default SerWaymarRoyce;
