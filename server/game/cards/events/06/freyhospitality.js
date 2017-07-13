const DrawCard = require('../../../drawcard.js');

class FreyHospitality extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller &&
                                                      this.controller.getNumberOfChallengesInitiated() === 3 &&
                                                      this.hasAttackingFrey()
            },
            handler: () => {
                let numTargets = this.game.currentChallenge.strengthDifference >= 20 ? 3 : 1;

                this.game.promptForSelect(this.controller, {
                    numCards: numTargets,
                    multiSelect: true,
                    activePromptTitle: 'Select character(s)',
                    source: this,
                    gameAction: 'kill',
                    cardCondition: card => card.location === 'play area' && 
                                           card.controller !== this.controller && 
                                           card.getType() === 'character',
                    onSelect: (player, cards) => this.targetsSelected(player, cards)
                });
            }
        });
    }

    targetsSelected(player, cards) {
        if(this.game.currentChallenge.strengthDifference >= 20 && cards.length !== 3) {
            return false;
        }
        
        this.game.killCharacters(cards);
        this.game.addMessage('{0} plays {1} to kill {2}', this.controller, this, cards);

        return true;
    }

    hasAttackingFrey() {
        return this.controller.anyCardsInPlay(card => this.game.currentChallenge.isAttacking(card) && 
                                                      card.hasTrait('House Frey') && 
                                                      card.getType() === 'character');
    }
}

FreyHospitality.code = '06079';

module.exports = FreyHospitality;
