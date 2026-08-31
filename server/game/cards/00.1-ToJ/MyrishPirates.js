import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/Tokens.js';

class MyrishPirates extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card === this && this.game.currentPhase === 'challenge'
            },
            handler: (context) => {
                this.context = context;

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Choose one',
                        buttons: [
                            { text: 'Move 1 gold', method: 'promptForMoveGold' },
                            { text: 'Move 1 power', method: 'promptForMovePower' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    promptForMoveGold() {
        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select a card with gold',
            source: this,
            cardCondition: (card) =>
                ['active plot', 'faction', 'play area'].includes(card.location) &&
                ['attachment', 'character', 'faction', 'location', 'plot'].includes(
                    card.getType()
                ) &&
                card.controller !== this.context.player &&
                card.hasToken(Tokens.gold),
            onSelect: (player, card) => this.promptForReceiver(card, true),
            onCancel: (player) => this.cancelSelection(player)
        });

        return true;
    }

    promptForMovePower() {
        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select a card with power',
            source: this,
            cardCondition: (card) =>
                ['active plot', 'faction', 'play area'].includes(card.location) &&
                ['attachment', 'character', 'faction', 'location', 'plot'].includes(
                    card.getType()
                ) &&
                card.controller !== this.context.player &&
                card.power > 0,
            onSelect: (player, card) => this.promptForReceiver(card, false),
            onCancel: (player) => this.cancelSelection(player)
        });

        return true;
    }

    promptForReceiver(from, moveGold) {
        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select a character',
            source: this,
            cardCondition: (card) =>
                card.location === 'play area' &&
                card.getType() === 'character' &&
                card.controller === this.context.player,
            onSelect: (player, card) => this.targetsSelected(from, card, moveGold),
            onCancel: (player) => this.cancelSelection(player)
        });

        return true;
    }

    targetsSelected(from, to, moveGold) {
        if (moveGold) {
            this.game.transferGold({ from: from, to: to, amount: 1 });
        } else {
            this.game.movePower(from, to, 1);
        }
        let token = moveGold ? 'gold' : 'power';
        this.game.addMessage(
            '{0} uses {1} to move 1 {2} from {3} to {4}',
            this.context.player,
            this,
            token,
            from,
            to
        );

        return true;
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);

        return true;
    }
}

MyrishPirates.code = '00117';

export default MyrishPirates;
