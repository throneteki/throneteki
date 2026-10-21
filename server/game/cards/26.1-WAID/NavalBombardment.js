import DrawCard from '../../drawcard.js';

class NavalBombardment extends DrawCard {
    // Naval Bombardment (26004)
    // Challenges Action: Choose an opponent who controls fewer locations than you. Until the end of
    // the phase, that player cannot initiate [intrigue] challenges against you.
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
