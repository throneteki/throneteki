import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FreyBastard extends DrawCard {
    // Frey Bastard (06078)
    // Bestow (2).
    // Reaction: After you win a challenge in which you control 2 or more attacking House Frey
    // characters, discard 1 gold from Frey Bastard to gain 1 power for your faction.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.getNumberOfAttackingFreys() >= 2 &&
                    context.source.controller.canGainFactionPower()
            },
            cost: ability.costs.discardGold(),
            message: '{player} discards a gold from {source} to gain 1 power for their faction',
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: 1
            }))
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
