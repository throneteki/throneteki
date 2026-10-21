import DrawCard from '../../drawcard.js';

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
                    (card) => this.isFacedownAttachment(card) && card.getPrintedType() !== 'event'
                ),
                ability.effects.canMarshalIntoShadows((card) => this.isFacedownAttachment(card)),
                ability.effects.canPlay(
                    (card) => this.isFacedownAttachment(card) && card.getPrintedType() === 'event'
                )
            ]
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isAttacking()
            },
            handler: (context) => {
                let opponent = context.event.challenge.loser;
                let topCard = opponent.drawDeck[0];

                context.player.attach(context.player, topCard, this, 'play', true);
                this.lastingEffect(() => ({
                    condition: () => !!topCard.parent,
                    targetLocation: 'any',
                    match: topCard,
                    effect: [
                        ability.effects.setCardType('attachment'),
                        ability.effects.addKeyword('Terminal')
                    ]
                }));

                this.game.addMessage(
                    "{0} uses {1} to attach the top card of {2}'s deck under {1}",
                    context.player,
                    this,
                    opponent
                );
            }
        });
    }

    isFacedownAttachment(card) {
        return (
            card.facedown &&
            card.controller === this.controller &&
            card.getType() === 'attachment' &&
            this.attachments.includes(card)
        );
    }
}

ValyriansCrew.code = '11047';

export default ValyriansCrew;
