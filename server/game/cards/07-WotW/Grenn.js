import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Grenn extends DrawCard {
    // Grenn (07010)
    // No attachments except Weapon.
    // Reaction: After you win a challenge in which Grenn is attacking, move 1 power from the losing
    // opponent's faction card to another attacking [thenightswatch] character. (Up to 2 power
    // instead if that character is standing.)
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isAttacking() &&
                    event.challenge.loser.faction.power > 0
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card !== context.source &&
                    card.isAttacking() &&
                    card.isFaction('thenightswatch') &&
                    card.getType() === 'character'
            },
            message: {
                format: "{player} uses {source} to move power from {otherPlayer}'s faction to {target}",
                args: {
                    otherPlayer: (context) => context.event.challenge.loser
                }
            },
            gameAction: GameActions.movePower((context) => ({
                from: context.event.challenge.loser.faction,
                to: context.target,
                amount:
                    context.event.challenge.loser.faction.power > 1 &&
                    context.target.kneeled === false
                        ? 2
                        : 1
            }))
        });
    }
}

Grenn.code = '07010';

export default Grenn;
