const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class JonArryn extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeSaved()
        });

        this.forcedInterrupt({
            when: {
                onCharacterKilled: event => event.card === this
            },
            message: '{player} is forced to allow each player to either draw 2 cards or gain 1 power',
            handler: () => {
                this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
                this.proceedToNextStep();
            }
        });
    }

    proceedToNextStep() {
        if(this.remainingPlayers.length > 0) {
            let currentPlayer = this.remainingPlayers.shift();
            let options = [];

            if(currentPlayer.canDraw()) {
                options.push({ text: 'Draw 2 cards', method: 'drawCards' });
            }

            if(currentPlayer.canGainFactionPower()) {
                options.push({ text: 'Gain 1 power', method: 'gainPower' });
            }
            options.push({ text: 'None', method: 'cancel' });

            if(options.length === 1) {
                this.game.addMessage('{0} cannot draw 2 cards or gain 1 power', currentPlayer);
                this.proceedToNextStep();
                return true;
            }

            this.game.promptWithMenu(currentPlayer, this, {
                activePrompt: {
                    menuTitle: `Choose for ${this.name}`,
                    buttons: options
                },
                source: this
            });
        }
    }

    drawCards(player) {
        this.game.addMessage('{0} chooses to draw 2 cards', player);
        this.game.resolveGameAction(GameActions.drawCards({ player: player, amount: 2, source: this }));
        this.proceedToNextStep();
        return true;
    }

    gainPower(player) {
        this.game.addMessage('{0} chooses to gain 1 power', player);
        this.game.resolveGameAction(GameActions.gainPower({ card: player.faction, amount: 1 }));
        this.proceedToNextStep();
        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} does not choose to draw 2 cards or gain 1 power', player);
        this.proceedToNextStep();
        return true;
    }
}

JonArryn.code = '23001';

module.exports = JonArryn;
