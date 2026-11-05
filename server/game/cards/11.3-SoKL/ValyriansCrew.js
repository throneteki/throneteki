import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ValyriansCrew extends DrawCard {
    // Valyrian's Crew (11047)
    // Stealth.
    // You may marshal or play facedown cards attached to Valyrian's Crew as if they were in your
    // hand.
    // Reaction: After you win a challenge in which Valyrian's Crew is attacking, attach the top
    // card of the losing opponent's deck to Valyrian's Crew facedown under your control, as an
    // attachment with terminal.
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
                    event.challenge.winner === context.player && context.source.isAttacking()
            },
            message: {
                format: "{player} uses {source} to attach the top card of {opponent}'s deck under {source}",
                args: { opponent: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.attach((context) => ({
                player: context.player,
                attachment: context.event.challenge.loser.drawDeck[0],
                target: context.source,
                facedown: true,
                asAttachment: { keywords: ['Terminal'] }
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

ValyriansCrew.code = '11047';

export default ValyriansCrew;
