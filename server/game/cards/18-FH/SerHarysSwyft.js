import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class SerHarysSwyft extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move gold',
            limit: ability.limit.perRound(2),
            condition: () => this.controller.getSpendableGold() >= 1,
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' && !card.hasToken(Tokens.gold)
            },
            handler: (context) => {
                this.game.transferGold({ from: this.controller, to: context.target, amount: 1 });
                this.game.addMessage(
                    '{0} uses {1} to move 1 gold from their gold pool to {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
        this.plotModifiers({
            gold: 1
        });
    }
}

SerHarysSwyft.code = '18006';

export default SerHarysSwyft;
