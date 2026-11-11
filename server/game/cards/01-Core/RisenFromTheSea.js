import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RisenFromTheSea extends DrawCard {
    // Risen from the Sea (01081)
    // Interrupt: When a [greyjoy] character would be killed, save it. Then, attach Risen from the
    // Sea to that character as a Condition attachment with the text: "Terminal. Attached character
    // gets +1 STR."
    setupCardAbilities(ability) {
        const attachToSaved = (context, card) => ({
            player: context.player,
            attachment: context.source,
            target: card,
            playingType: 'play',
            asAttachment: {
                keywords: ['Terminal'],
                traits: ['Condition'],
                effect: ability.effects.modifyStrength(1)
            }
        });
        const canSurviveBurn = (card, context) =>
            GameActions.attach(attachToSaved(context, card)).allow(context) &&
            card.getBoostedStrength(1) > 0;

        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.card.canBeSaved() &&
                    (event.isBurn ? canSurviveBurn(event.card, context) : event.allowSave) &&
                    event.card.isFaction('greyjoy') &&
                    event.card.controller === context.player
            },
            location: 'hand',
            message: {
                format: '{player} plays {source} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.simultaneously([
                GameActions.saveCard((context) => ({ event: context.event, remediesBurn: true })),
                GameActions.attach((context) => attachToSaved(context, context.event.card))
            ])
        });
    }
}

RisenFromTheSea.code = '01081';

export default RisenFromTheSea;
