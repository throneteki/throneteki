import DrawCard from '../../drawcard.js';

class NavalBombardment extends DrawCard {
    setupCardAbilities() {
        this.action({
            phase: 'challenge',
            chooseOpponent: (player) =>
                player.getNumberOfCardsInPlay({ type: 'location' }) <
                this.controller.getNumberOfCardsInPlay({ type: 'location' }),
            message:
                '{player} plays {source} to prevent {opponent} from initiating intrigue challenges against them until the end of the phase',
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    targetController: context.opponent,
                    effect: ability.effects.cannotInitiateChallengeType(
                        'intrigue',
                        (opponent) => opponent === this.controller
                    )
                }));
            }
        });
    }
}

NavalBombardment.code = '26004';

export default NavalBombardment;
