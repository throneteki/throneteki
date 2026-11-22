import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BloodMagicRitual extends DrawCard {
    // Blood Magic Ritual (02094)
    // Interrupt: When a non-Army character would be killed, save it. Then, attach Blood Magic
    // Ritual to that character as a Condition attachment with the text: "Terminal. Treat attached
    // character's printed text box as if it were blank (except for Traits)."
    setupCardAbilities(ability) {
        const attachToSaved = (context, card) => ({
            player: context.player,
            attachment: context.source,
            target: card,
            playingType: 'play',
            asAttachment: {
                keywords: ['Terminal'],
                traits: ['Condition'],
                effect: ability.effects.blankExcludingTraits
            }
        });
        const canSurviveBurn = (card, context) =>
            GameActions.attach(attachToSaved(context, card)).allow(context) &&
            card.getStrengthIfTextBoxBlank() > 0;

        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.card.canBeSaved() &&
                    (event.isBurn ? canSurviveBurn(event.card, context) : event.allowSave) &&
                    !event.card.hasTrait('Army')
            },
            location: 'hand',
            message: {
                format: '{player} plays {source} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({
                event: context.event,
                remediesBurn: true
            })).then({
                gameAction: GameActions.attach((context) =>
                    attachToSaved(context, context.parentContext.event.card)
                )
            })
        });
    }
}

BloodMagicRitual.code = '02094';

export default BloodMagicRitual;
