import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Jhogo extends DrawCard {
    // Jhogo (15007)
    // Reaction: After you win a [military] challenge in which you control 2 or more attacking
    // Dothraki characters, move 1 power from the losing opponent's faction card to your own.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.challengeType === 'military' &&
                    context.source.getNumberOfAttackingDothrakis() >= 2
            },
            message: {
                format: "{player} uses {source} to move 1 power from {otherPlayer}'s faction to their own",
                args: { otherPlayer: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.movePower((context) => ({
                from: context.event.challenge.loser.faction,
                to: context.player.faction,
                amount: 1
            }))
        });
    }

    getNumberOfAttackingDothrakis() {
        let cards = this.controller.filterCardsInPlay((card) => {
            return (
                card.isAttacking() && card.hasTrait('Dothraki') && card.getType() === 'character'
            );
        });

        return cards.length;
    }
}

Jhogo.code = '15007';

export default Jhogo;
