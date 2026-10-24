import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DagmerCleftjaw extends DrawCard {
    // Dagmer Cleftjaw (02111)
    // Renown.
    // Interrupt: When claim is applied for a challenge in which Dagmer Cleftjaw is attacking alone,
    // choose a non-limited location with printed cost 3 or lower controlled by the losing opponent.
    // Instead of the normal claim effects, take control of that location.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: (event, context) =>
                    event.challenge &&
                    event.challenge.isMatch({
                        winner: context.player,
                        attackingAlone: context.source
                    })
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'location' &&
                    card.getPrintedCost() <= 3 &&
                    !card.isLimited() &&
                    card.controller === context.event.challenge.loser
            },
            message:
                '{player} uses {source} to take control of {target} instead of normal claim effects',
            gameAction: GameActions.replaceEvent((context) => ({
                event: context.event,
                replacement: GameActions.takeControl({
                    player: context.player,
                    card: context.target
                })
            }))
        });
    }
}

DagmerCleftjaw.code = '02111';

export default DagmerCleftjaw;
