import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class Balerion extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeKilled()
        });
        this.action({
            title: 'Discard 1 gold',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) => card.hasToken(Tokens.gold)
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to discard 1 gold from {2}',
                    this.controller,
                    this,
                    context.target
                );
                context.target.modifyToken(Tokens.gold, -1);
            }
        });
    }
}

Balerion.code = '18018';

export default Balerion;
