import DrawCard from '../../drawcard.js';

class FreyBastard extends DrawCard {
    // Frey Bastard (06078)
    // Bestow (2).
    // Reaction: After you win a challenge in which you control 2 or more attacking House Frey
    // characters, discard 1 gold from Frey Bastard to gain 1 power for your faction.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.getNumberOfAttackingFreys() >= 2 &&
                    this.controller.canGainFactionPower()
            },
            cost: ability.costs.discardGold(),
            handler: () => {
                this.game.addPower(this.controller, 1);
                this.game.addMessage(
                    '{0} discards a gold from {1} to gain 1 power for their faction',
                    this.controller,
                    this
                );
            }
        });
    }

    getNumberOfAttackingFreys() {
        let cards = this.controller.filterCardsInPlay((card) => {
            return (
                card.isAttacking() && card.hasTrait('House Frey') && card.getType() === 'character'
            );
        });

        return cards.length;
    }
}

FreyBastard.code = '06078';

export default FreyBastard;
