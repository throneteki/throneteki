import DrawCard from '../../drawcard.js';

class MirriMazDuur extends DrawCard {
    // Mirri Maz Duur (02093)
    // Interrupt: When claim is applied for a challenge in which Mirri Maz Duur is attacking alone,
    // choose a character controlled by the losing opponent. Instead of the normal claim effects,
    // kill that character.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge &&
                    event.challenge.isMatch({ winner: this.controller, attackingAlone: this })
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.game.currentChallenge.loser,
                gameAction: 'kill'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to kill {2} instead of normal claim effects',
                    context.player,
                    this,
                    context.target
                );

                context.replaceHandler(() => {
                    this.game.killCharacter(context.target);
                });
            }
        });
    }
}

MirriMazDuur.code = '02093';

export default MirriMazDuur;
