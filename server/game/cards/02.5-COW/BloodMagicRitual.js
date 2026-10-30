import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BloodMagicRitual extends DrawCard {
    // Blood Magic Ritual (02094)
    // Interrupt: When a non-Army character would be killed, save it. Then, attach Blood Magic
    // Ritual to that character as a Condition attachment with the text: "Terminal. Treat attached
    // character's printed text box as if it were blank (except for Traits)."
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave && event.card.canBeSaved() && !event.card.hasTrait('Army')
            },
            location: 'hand',
            message: {
                format: '{player} plays {source} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event })).then({
                gameAction: GameActions.attach((context) => ({
                    player: context.player,
                    attachment: context.source,
                    target: context.parentContext.event.card,
                    playingType: 'play',
                    asAttachment: {
                        keywords: ['Terminal'],
                        traits: ['Condition'],
                        effect: ability.effects.blankExcludingTraits
                    }
                }))
            })
        });
    }
}

BloodMagicRitual.code = '02094';

export default BloodMagicRitual;
