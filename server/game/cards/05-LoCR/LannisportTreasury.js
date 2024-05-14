import range from 'lodash.range';
import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class LannisportTreasury extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event) =>
                    event.phase === 'taxation' && this.controller.getSpendableGold() >= 1
            },
            handler: () => {
                this.game.transferGold({ from: this.controller, to: this, amount: 1 });
                this.game.addMessage(
                    '{0} moves 1 gold from their gold pool to {1}',
                    this.controller,
                    this
                );
            }
        });

        this.action({
            title: 'Move gold to gold pool',
            phase: 'marshal',
            condition: () => this.hasToken(Tokens.gold),
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                let rangeArray = range(1, this.tokens[Tokens.gold] + 1).reverse();
                let buttons = rangeArray.map((gold) => {
                    return { text: gold, method: 'moveGold', arg: gold };
                });

                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Select gold amount',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    moveGold(player, gold) {
        this.game.transferGold({ from: this, to: player, amount: gold });
        this.game.addMessage(
            '{0} moves {1} gold from {2} to their gold pool',
            this.controller,
            gold,
            this
        );

        return true;
    }
}

LannisportTreasury.code = '05019';

export default LannisportTreasury;
