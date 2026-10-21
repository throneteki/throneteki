import DrawCard from '../../drawcard.js';

class DagmerCleftjaw extends DrawCard {
    // Dagmer Cleftjaw (02111)
    // Renown.
    // Interrupt: When claim is applied for a challenge in which Dagmer Cleftjaw is attacking alone,
    // choose a non-limited location with printed cost 3 or lower controlled by the losing opponent.
    // Instead of the normal claim effects, take control of that location.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge &&
                    event.challenge.isMatch({ winner: this.controller, attackingAlone: this })
            },
            target: {
                activePromptTitle: 'Select a location',
                source: this,
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'location' &&
                    card.getPrintedCost() <= 3 &&
                    !card.isLimited() &&
                    card.controller === this.game.currentChallenge.loser
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to take control of {2} instead of normal claim effects',
                    context.player,
                    this,
                    context.target
                );
                context.replaceHandler(() => {
                    this.game.takeControl(context.player, context.target);
                });
            }
        });
    }
}

DagmerCleftjaw.code = '02111';

export default DagmerCleftjaw;
