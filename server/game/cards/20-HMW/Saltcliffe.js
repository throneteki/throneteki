import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class Saltcliffe extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move gold',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    !card.hasToken(Tokens.gold) &&
                    card.getType() === 'character' &&
                    card.hasTrait('Raider')
            },
            handler: (context) => {
                this.target = context.target;
                if (this.game.anyCardsInPlay((card) => card.hasToken(Tokens.gold))) {
                    this.game.promptWithMenu(context.player, this, {
                        activePrompt: {
                            menuTitle: 'Move gold from treasury or card?',
                            buttons: [
                                { text: 'Treasury', method: 'moveGoldFromTreasury' },
                                { text: 'Card', method: 'moveGoldFromCard' }
                            ]
                        },
                        source: this
                    });
                } else {
                    this.moveGoldFromTreasury(context.player);
                }
            }
        });
    }

    moveGoldFromTreasury(player) {
        this.target.modifyToken(Tokens.gold, 1);
        this.game.addMessage('{0} kneels {1} to have {2} gain 1 gold', player, this, this.target);

        return true;
    }

    moveGoldFromCard(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            source: this,
            cardCondition: (card) => card.location === 'play area' && card.hasToken(Tokens.gold),
            onSelect: (player, card) => this.goldSourceSelected(player, card)
        });

        return true;
    }

    goldSourceSelected(player, card) {
        this.game.transferGold({ from: card, to: this.target, amount: 1 });
        this.game.addMessage(
            '{0} uses {1} to move 1 gold from {2} to {3}',
            player,
            this,
            card,
            this.target
        );

        return true;
    }
}

Saltcliffe.code = '20008';

export default Saltcliffe;
