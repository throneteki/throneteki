import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LivingShadow extends DrawCard {
    // Living Shadow (26081)
    // No attachments. Shadow (1). Stealth.
    // Living Shadow cannot be killed.
    // Forced Reaction: After Living Shadow bypasses a character using stealth, attach it to that
    // character as a Condition attachment with the text: "Terminal. Attached character cannot be
    // saved."
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card === context.source,
            effect: ability.effects.cannotBeKilled()
        });

        this.forcedReaction({
            when: {
                onBypassedByStealth: (event, context) => event.source === context.source
            },
            message: {
                format: '{player} is forced to attach {source} to {character}',
                args: { character: (context) => context.event.target }
            },
            gameAction: GameActions.attach((context) => ({
                player: context.player,
                attachment: context.source,
                target: context.event.target,
                playingType: 'effect',
                asAttachment: {
                    keywords: ['Terminal'],
                    traits: ['Condition'],
                    effect: ability.effects.cannotBeSaved()
                }
            }))
        });
    }
}

LivingShadow.code = '26081';

export default LivingShadow;
