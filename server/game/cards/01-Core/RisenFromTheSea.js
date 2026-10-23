import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RisenFromTheSea extends DrawCard {
    // Risen from the Sea (01081)
    // Interrupt: When a [greyjoy] character would be killed, save it. Then, attach Risen from the
    // Sea to that character as a Condition attachment with the text: "Terminal. Attached character
    // gets +1 STR."
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) => canSaveVsEvent(event, context)
            },
            location: 'hand',
            message: {
                format: '{player} plays {source} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.simultaneously([
                GameActions.saveCard((context) => ({ event: context.event, remediesBurn: true })),
                GameActions.attach((context) => ({
                    player: context.player,
                    attachment: context.source,
                    target: context.event.card,
                    playingType: 'play',
                    asCondition: ability.effects.modifyStrength(1)
                }))
            ])
        });
    }

    // Explicitly override since it has printed type 'event'.
    canAttach(player, card) {
        return card.getType() === 'character';
    }
}

function canSaveVsEvent(event, context) {
    const card = event.card;

    if (!card.canBeSaved()) {
        return false;
    }

    const allowSave = event.isBurn ? canSurviveBurn(card, context) : event.allowSave;

    return allowSave && card.isFaction('greyjoy') && card.controller === context.player;
}

function canSurviveBurn(card, context) {
    return card.controller.canAttach(context.source, card) && card.getBoostedStrength(1) > 0;
}

RisenFromTheSea.code = '01081';

export default RisenFromTheSea;
