import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class VengeanceForElia extends DrawCard {
    // Vengeance for Elia (02096)
    // Interrupt: When claim is applied for a challenge in which you are the defending player,
    // choose an opponent. That player must satisfy the normal claim effect instead of you as if he
    // or she were the defending player.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: (event, context) =>
                    !!event.challenge && event.challenge.defendingPlayer === context.player
            },
            chooseOpponent: true,
            message: '{player} plays {source} to have {opponent} satisfy claim instead',
            gameAction: GameActions.replaceEvent((context) => {
                const claim = context.event.claim.clone();
                claim.replaceRecipient(context.player, context.opponent);
                return {
                    event: context.event,
                    replacement: GameActions.satisfyClaim({ claim, game: context.game })
                };
            })
        });
    }
}

VengeanceForElia.code = '02096';

export default VengeanceForElia;
