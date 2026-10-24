import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LadyMarya extends DrawCard {
    // Lady Marya (25002)
    // You may marshal or play facedown cards attached to Lady Marya as if they were in your hand.
    // Reaction: After you win a challenge in which you control an attacking Captain or Smuggler
    // character, kneel Lady Marya to attach the top card of the losing opponent's deck to Lady
    // Marya facedown under your control, as an attachment with the text: "Location only. Terminal."
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [
                ability.effects.canMarshal(
                    (card, context) =>
                        isFacedownAttachment(card, context) && card.getPrintedType() !== 'event'
                ),
                ability.effects.canMarshalIntoShadows((card, context) =>
                    isFacedownAttachment(card, context)
                ),
                ability.effects.canPlay(
                    (card, context) =>
                        isFacedownAttachment(card, context) && card.getPrintedType() === 'event'
                )
            ]
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.player,
                        attackingPlayer: context.player
                    }) &&
                    event.challenge
                        .getWinnerCards()
                        .some((card) => card.hasTrait('Captain') || card.hasTrait('Smuggler'))
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: "{player} kneels {costs.kneel} to attach the top card of {loser}'s deck facedown under {source}",
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.attach((context) => ({
                player: context.player,
                attachment: context.event.challenge.loser.drawDeck[0],
                target: context.source,
                facedown: true,
                asAttachment: {
                    keywords: ['Terminal'],
                    attachmentEffect: ability.effects.addAttachmentRestriction({ type: 'location' })
                }
            }))
        });
    }
}

function isFacedownAttachment(card, context) {
    return (
        card.facedown &&
        card.controller === context.source.controller &&
        card.getType() === 'attachment' &&
        context.source.attachments.includes(card)
    );
}

LadyMarya.code = '25002';

export default LadyMarya;
