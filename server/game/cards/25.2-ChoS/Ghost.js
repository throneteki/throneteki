import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Ghost extends DrawCard {
    // Ghost (25031)
    // No attachments.
    // Reaction: After you win a challenge in which you control an attacking Direwolf character,
    // draw 1 card.
    // Interrupt: When Jon Snow would be killed, sacrifice Ghost to save him.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    context.player.anyCardsInPlay(
                        (card) =>
                            card.isAttacking() &&
                            card.hasTrait('Direwolf') &&
                            card.getType() === 'character'
                    )
            },
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });

        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave && event.card.canBeSaved() && event.card.name === 'Jon Snow'
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {costs.sacrifice} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

Ghost.code = '25031';

export default Ghost;
