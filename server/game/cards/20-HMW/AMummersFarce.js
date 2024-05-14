const AgendaCard = require('../../agendacard');

class AMummersFarce extends AgendaCard {
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

        this.forcedReaction({
            when: {
                onCardStood: (event) =>
                    event.card.controller === this.controller &&
                    event.card.hasTrait('Fool') &&
                    this.isCardEligibleToHaveFacedownWeaponAttachments(event.card)
            },
            handler: (context) => {
                let topCard = context.player.drawDeck[0];
                if (topCard) {
                    context.player.attach(
                        context.player,
                        topCard,
                        context.event.card,
                        'play',
                        true
                    );
                    this.lastingEffect((ability) => ({
                        condition: () => !!topCard.parent && topCard.facedown,
                        targetLocation: 'any',
                        match: topCard,
                        effect: [
                            ability.effects.setCardType('attachment'),
                            ability.effects.addKeyword('Terminal'),
                            ability.effects.addTrait('Weapon')
                        ]
                    }));

                    this.lastingEffect((ability) => ({
                        condition: () => topCard.location === 'play area' && topCard.facedown,
                        targetLocation: 'any',
                        targetController: 'any',
                        match: (card) => card === topCard.parent,
                        effect: ability.effects.modifyStrength(1)
                    }));

                    this.game.addMessage(
                        '{0} uses {1} to attach the top card of their deck under {2}',
                        context.player,
                        this,
                        context.event.card
                    );
                }
            }
        });
    }

    isFacedownAttachment(card) {
        return (
            card.facedown &&
            card.controller === this.controller &&
            card.getType() === 'attachment' &&
            card.parent.hasTrait('Fool')
        );
    }

    isCardEligibleToHaveFacedownWeaponAttachments(card) {
        let noAttachmentKeywords = card
            .getKeywords()
            .filter((keyword) => keyword.startsWith('no attachments'));
        return (
            noAttachmentKeywords.length === 0 ||
            (noAttachmentKeywords.length === 1 &&
                noAttachmentKeywords[0] === 'no attachments except <i>weapon</i>')
        );
    }
}

AMummersFarce.code = '20051';

module.exports = AMummersFarce;
