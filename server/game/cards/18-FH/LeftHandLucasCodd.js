import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class LeftHandLucasCodd extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onDefendersDeclared: (event) =>
                    event.player !== this.controller &&
                    event.numOfDefendingCharacters === 0 &&
                    this.hasAttackingRaider()
            },
            handler: (context) => {
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select card to place 1 gold on',
                    cardCondition: (card) => card.location === 'play area',
                    source: this,
                    onSelect: (player, card) => this.onCardSelectedForGold(player, card)
                });
            }
        });
    }

    hasAttackingRaider() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.isAttacking() && card.hasTrait('Raider') && card.getType() === 'character'
        );
    }

    onCardSelectedForGold(player, card) {
        card.modifyToken(Tokens.gold, 1);
        this.game.addMessage(
            '{0} uses {1} to place 1 gold from the treasury on {2}',
            player,
            this,
            card
        );
        return true;
    }
}

LeftHandLucasCodd.code = '18003';

export default LeftHandLucasCodd;
