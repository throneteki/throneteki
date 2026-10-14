import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/Tokens.js';

class SaltcliffeMarauder extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.hasToken(Tokens.gold),
            match: this,
            effect: ability.effects.addKeyword('stealth')
        });

        this.action({
            title: 'Discard 1 gold from ' + this.name,
            cost: ability.costs.discardGold(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('stealth')
                }));

                this.game.addMessage(
                    '{0} discards 1 gold from {1} to have {2} gain stealth until the end of the phase',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

SaltcliffeMarauder.code = '00143';

export default SaltcliffeMarauder;
