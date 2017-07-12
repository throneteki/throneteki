const DrawCard = require('../../../drawcard.js');

class DornishRevenge extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: event => event.challenge.attackingPlayer === this.controller
            },
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => (
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller !== this.controller)
            },
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.mustBeDeclaredAsDefender()
                }));

                this.game.addMessage('{0} plays {1} to force {2} to be declared as a defender this challenge, if able', 
                                      this.controller, this, context.target);

                this.game.once('afterChallenge:interrupt', (event, challenge) => this.resolveIfWinBy5(challenge));
            }
        });
    }

    resolveIfWinBy5(challenge) {
        if(challenge.winner !== this.controller || challenge.strengthDifference < 5) {
            return;
        }

        let opponent = this.game.getOtherPlayer(this.controller);

        this.game.addMessage('{0} uses {1} to have {2} choose and kill a defending character', 
                              this.controller, this, opponent);

        this.game.promptForSelect(opponent, {
            activePromptTitle: 'Select a character to kill',
            source: this,
            cardCondition: card => (
                card.location === 'play area' && 
                card.getType() === 'character' && 
                card.controller !== this.controller &&
                challenge.isDefending(card)),
            gameAction: 'kill',
            onSelect: (p, card) => {
                card.controller.killCharacter(card);
                this.game.addMessage('{0} chooses to kill {1}', opponent, card);
                        
                return true;
            }
        });
    }
}

DornishRevenge.code = '06096';

module.exports = DornishRevenge;
