const DrawCard = require('../../../drawcard.js');

class PodrickPayne extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            location: 'hand',
            when: {
                onCharactersKilled: () => this.game.claim.isApplying && this.game.claim.type === 'military'
            },
            target: {
                activePromptTitle: 'Select character to save',
                cardCondition: (card, context) => context.event.cards.includes(card) && card.controller === this.controller
            },
            cost: [
                ability.costs.payGold(2),
                ability.costs.putSelfIntoPlay()
            ],
            handler: context => {
                context.event.saveCard(context.target);
                this.game.addMessage('{0} puts {1} into play and pays 2 gold to save {2}', 
                    this.controller, this, context.target);

                if(context.target.name === 'Tyrion Lannister' && this.controller.gold >= 2 &&
                   this.game.currentChallenge && this.game.currentChallenge.attackers.length >= 1) {
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
            activePromptTitle: 'Select a character',
            source: this,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' &&
                                   this.game.currentChallenge.isAttacking(card),
            gameAction: 'kill',
            onSelect: (p, card) => {
                this.game.addGold(this.controller, -2);
                card.controller.killCharacter(card);
                this.game.addMessage('{0} then uses {1} and pays 2 gold to kill {2}', this.controller, this, card);
                        
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
