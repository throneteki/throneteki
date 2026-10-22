import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class VaramyrSixskins extends DrawCard {
    // Varamyr Sixskins (11001)
    // Reaction: After the challenges phase begins, until the end of the phase, Varamyr Sixskins
    // gains (choose one):
    // - the Bear trait and gets +5 STR.
    // - the Eagle trait, an [intrigue] icon, and insight.
    // - the Cat trait, a [power] icon, and stealth.
    // - the Wolf trait and intimidate, and gets +2 STR.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            gameAction: GameActions.choose({
                title: 'Choose one',
                choices: {
                    Bear: {
                        message:
                            '{player} uses {source} and has it gain the Bear trait and 5 STR until the end of the phase',
                        gameAction: GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.source,
                            effect: [
                                ability.effects.addTrait('Bear'),
                                ability.effects.modifyStrength(5)
                            ]
                        }))
                    },
                    Eagle: {
                        message:
                            '{player} uses {source} and has it gain the Eagle trait, an intrigue icon and insight until the end of the phase',
                        gameAction: GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.source,
                            effect: [
                                ability.effects.addTrait('Eagle'),
                                ability.effects.addIcon('intrigue'),
                                ability.effects.addKeyword('insight')
                            ]
                        }))
                    },
                    Cat: {
                        message:
                            '{player} uses {source} and has it gain the Cat trait, a power icon and stealth until the end of the phase',
                        gameAction: GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.source,
                            effect: [
                                ability.effects.addTrait('Cat'),
                                ability.effects.addIcon('power'),
                                ability.effects.addKeyword('stealth')
                            ]
                        }))
                    },
                    Wolf: {
                        message:
                            '{player} uses {source} and has it gain the Wolf trait, intimidate and 2 STR until the end of the phase',
                        gameAction: GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.source,
                            effect: [
                                ability.effects.addTrait('Wolf'),
                                ability.effects.modifyStrength(2),
                                ability.effects.addKeyword('intimidate')
                            ]
                        }))
                    }
                }
            })
        });
    }
}

VaramyrSixskins.code = '11001';

export default VaramyrSixskins;
