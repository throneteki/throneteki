const DrawCard = require('../../drawcard.js');

class PodrickPayne extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            location: 'hand',
            when: {
                onCharacterKilled: (event) =>
                    this.game.claim.isApplying &&
                    this.game.claim.type === 'military' &&
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    event.card.controller === this.controller
            },
            cost: [ability.costs.payGold(2), ability.costs.putSelfIntoPlay()],
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} puts {1} into play and pays 2 gold to save {2}',
                    this.controller,
                    this,
                    context.event.card
                );

                if (
                    context.event.card.name === 'Tyrion Lannister' &&
                    this.controller.getSpendableGold() >= 2 &&
                    this.game.currentChallenge &&
                    this.game.currentChallenge.attackers.length >= 1
                ) {
                    this.game.promptWithMenu(this.controller, this, {
                        activePrompt: {
                            menuTitle: 'Pay two gold to kill an attacking character?',
                            buttons: [
                                { text: 'Yes', method: 'killAttacker' },
                                { text: 'No', method: 'cancel' }
                            ]
                        },
                        source: this
                    });
                }
            }
        });
    }

    killAttacker() {
        this.game.promptForSelect(this.controller, {
            source: this,
            cardCondition: (card) =>
                card.location === 'play area' &&
                card.getType() === 'character' &&
                card.isAttacking(),
            gameAction: 'kill',
            onSelect: (p, card) => {
                this.game.spendGold({ amount: 2, player: this.controller });
                card.controller.killCharacter(card);
                this.game.addMessage(
                    '{0} then uses {1} and pays 2 gold to kill {2}',
                    this.controller,
                    this,
                    card
                );

                return true;
            }
        });

        return true;
    }

    cancel() {
        return true;
    }
}

PodrickPayne.code = '04109';

module.exports = PodrickPayne;
