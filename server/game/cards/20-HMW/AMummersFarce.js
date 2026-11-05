import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class AMummersFarce extends AgendaCard {
    // A Mummer's Farce (20051)
    // Your deck may include non-loyal Fool characters from any faction.
    // You may marshal or play facedown cards you control attached to a Fool character as if they
    // were in your hand.
    // Forced Reaction: After a Fool character you control stands, attach the top card of your deck
    // facedown to it, as a Weapon attachment with the text: "Terminal. Attached character gets +1
    // STR."
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

        this.forcedReaction({
            when: {
                onCardStood: (event, context) =>
                    event.card.controller === context.player && event.card.hasTrait('Fool')
            },
            message: {
                format: '{player} uses {source} to attach the top card of their deck under {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.attach((context) => ({
                player: context.player,
                attachment: context.player.drawDeck[0],
                target: context.event.card,
                facedown: true,
                asAttachment: {
                    keywords: ['Terminal'],
                    traits: ['Weapon'],
                    effect: ability.effects.modifyStrength(1)
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
        !!card.parent &&
        card.parent.hasTrait('Fool')
    );
}

AMummersFarce.code = '20051';

export default AMummersFarce;
