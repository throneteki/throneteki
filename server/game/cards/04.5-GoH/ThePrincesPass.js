const DrawCard = require('../../drawcard.js');

class ThePrincesPass extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.loser === this.controller && event.challenge.defendingPlayer === this.controller
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && this.game.currentChallenge.isAttacking(card)
            },
            handler: context => {
                this.targetCharacter = context.target;

                this.game.promptForIcon(this.controller, this, icon => {
                    this.untilEndOfPhase(ability => ({
                        match: this.targetCharacter,
                        effect: ability.effects.removeIcon(icon)
                    }));

                    this.game.addMessage('{0} kneels {1} to remove {2} {3} icon from {4}',
                        this.controller, this, icon === 'intrigue' ? 'an' : 'a', icon, this.targetCharacter);

                    if(this.targetCharacter.getNumberOfIcons() === 0) {
                        this.game.promptWithMenu(this.controller, this, {
                            activePrompt: {
                                menuTitle: 'Sacrifice ' + this.name + ' to discard ' + this.targetCharacter.name + '?',
                                buttons: [
                                    { text: 'Yes', method: 'sacrifice' },
                                    { text: 'No', method: 'pass' }
                                ]
                            },
                            source: this
                        });
                    }
                });
            }
        });
    }

    sacrifice() {
        this.controller.sacrificeCard(this);
        this.targetCharacter.controller.discardCard(this.targetCharacter);
        this.game.addMessage('{0} sacrifices {1} to discard {2} from play', this.controller, this, this.targetCharacter);
        return true;
    }

    pass() {
        this.game.addMessage('{0} declines to sacrifice {1}', this.controller, this);
        return true;
    }
}

ThePrincesPass.code = '04096';

module.exports = ThePrincesPass;
