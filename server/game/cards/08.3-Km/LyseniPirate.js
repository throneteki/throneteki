import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class LyseniPirate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.controller.anyCardsInPlay(
                    (card) => card.hasTrait('Warship') && card.getType() === 'location'
                ),
            match: this,
            effect: ability.effects.addKeyword('stealth')
        });

        //TODO: possibly rework this into using the target API, with the faction card acting as the gold pool target
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.isAttacking() &&
                    (this.loserHasGold(event.challenge.loser) ||
                        this.loserHasGoldOnCard(event.challenge.loser))
            },
            handler: (context) => {
                this.context = context;
                let loser = context.event.challenge.loser;

                if (this.loserHasGold(loser) && this.loserHasGoldOnCard(loser)) {
                    this.game.promptWithMenu(context.player, this, {
                        activePrompt: {
                            menuTitle: 'Move gold from gold pool or card?',
                            buttons: [
                                { text: 'Gold pool', method: 'moveGoldFromGoldPool' },
                                { text: 'Card', method: 'moveGoldFromCard' }
                            ]
                        },
                        source: this
                    });
                } else if (this.loserHasGold(loser)) {
                    this.moveGoldFromGoldPool();
                } else if (this.loserHasGoldOnCard(loser)) {
                    this.moveGoldFromCard();
                }
            }
        });
    }

    moveGoldFromGoldPool() {
        this.game.transferGold({
            from: this.context.event.challenge.loser,
            to: this.context.player,
            amount: 1
        });
        this.game.addMessage(
            "{0} uses {1} to move 1 gold from {2}'s gold pool to their own",
            this.context.player,
            this,
            this.context.event.challenge.loser
        );

        return true;
    }

    moveGoldFromCard() {
        this.game.promptForSelect(this.context.player, {
            activePromptTitle: 'Select a card',
            source: this,
            cardCondition: (card) =>
                card.location === 'play area' &&
                card.controller === this.context.event.challenge.loser &&
                card.hasToken(Tokens.gold),
            onSelect: (player, card) => this.targetSelected(player, card)
        });

        return true;
    }

    targetSelected(player, card) {
        this.game.transferGold({ from: card, to: this.context.player, amount: 1 });
        this.game.addMessage(
            '{0} uses {1} to move 1 gold from {2} to their gold pool',
            this.context.player,
            this,
            card
        );

        return true;
    }

    loserHasGold(loser) {
        return loser.gold >= 1;
    }

    loserHasGoldOnCard(loser) {
        return loser.anyCardsInPlay((card) => card.hasToken(Tokens.gold));
    }
}

LyseniPirate.code = '08047';

export default LyseniPirate;
