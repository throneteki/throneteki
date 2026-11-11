import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NavalBombardment extends DrawCard {
    // Naval Bombardment (26004)
    // Challenges Action: Choose an opponent who controls fewer locations than you. Until the end of
    // the phase, that player cannot initiate [intrigue] challenges against you.
    setupCardAbilities(ability) {
        this.action({
            phase: 'challenge',
            chooseOpponent: (player, context) =>
                player.getNumberOfCardsInPlay({ type: 'location' }) <
                context.player.getNumberOfCardsInPlay({ type: 'location' }),
            message:
                '{player} plays {source} to prevent {opponent} from initiating intrigue challenges against them until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                targetController: context.opponent,
                effect: ability.effects.cannotInitiateChallengeType(
                    'intrigue',
                    (opponent) => opponent === context.player
                )
            }))
        });
    }
}

NavalBombardment.code = '26004';

export default NavalBombardment;
