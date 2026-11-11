import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class RedRain extends DrawCard {
    // Red Rain (12021)
    // Unique [greyjoy] character only.
    // If attached character is The Drumm, he gains stealth.
    // Reaction: After you win an unopposed challenge in which attached character is attacking, it
    // gains 2 power. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'greyjoy', unique: true });

        this.whileAttached({
            match: (card) => card.name === 'The Drumm',
            effect: ability.effects.addKeyword('Stealth')
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.source.controller,
                        unopposed: true
                    }) &&
                    context.source.parent.isAttacking() &&
                    context.source.parent.canGainPower()
            },
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} uses {source} to have {parent} gain 2 power',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.source.parent,
                amount: 2
            }))
        });
    }
}

RedRain.code = '12021';

export default RedRain;
