import DrawCard from '../../drawcard.js';

class SyrioForel extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character military icon and stealth',
            limit: ability.limit.perPhase(1),
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to give {2} a {3} icon and stealth until the end of the phase',
                    this.controller,
                    this,
                    context.target,
                    'military'
                );
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: [
                        ability.effects.addIcon('military'),
                        ability.effects.addKeyword('Stealth')
                    ]
                }));
            }
        });
    }
}

SyrioForel.code = '02037';

export default SyrioForel;
