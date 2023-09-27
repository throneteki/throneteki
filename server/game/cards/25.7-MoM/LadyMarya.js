const DrawCard = require('../../drawcard.js');

class LadyMarya extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [
                ability.effects.canMarshal(card => this.isFacedownAttachment(card) && card.getPrintedType() !== 'event'),
                ability.effects.canMarshalIntoShadows(card => this.isFacedownAttachment(card)),
                ability.effects.canPlay(card => this.isFacedownAttachment(card) && card.getPrintedType() === 'event')
            ]
        });

        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ winner: this.controller, attackingPlayer: this.controller })
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {costs.kneel} to attach the top card of {loser}\'s deck facedown under {source}',
                args: { loser: context => context.event.challenge.loser }
            },
            handler: context => {
                let opponent = context.event.challenge.loser;
                let topCard = opponent.drawDeck[0];

                // TODO: Add attach to GameActions
                context.player.attach(context.player, topCard, this, 'play', true);
                this.lastingEffect(() => ({
                    condition: () => !!topCard.parent,
                    targetLocation: 'any',
                    match: topCard,
                    effect: [
                        ability.effects.setCardType('attachment'),
                        ability.effects.addKeyword('Terminal'),
                        ability.effects.addAttachmentRestriction({ type: 'location' })
                    ]
                }));
            }
        });
    }

    isFacedownAttachment(card) {
        return card.facedown && card.controller === this.controller && card.getType() === 'attachment' && this.attachments.includes(card);
    }
}

LadyMarya.code = '25508';
LadyMarya.version = '1.1';

module.exports = LadyMarya;
