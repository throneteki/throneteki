const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class FreyHospitality extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    this.controller.getNumberOfChallengesInitiated() === 3 &&
                    this.hasAttackingFrey())
            },
            handler: () => {
                let numTargets = this.game.currentChallenge.strengthDifference >= 20 ? 3 : 1;

                this.game.promptForSelect(this.controller, {
                    numCards: numTargets,
                    multiSelect: true,
                    activePromptTitle: 'Select ' + numTargets + ' character(s)',
                    source: this,
                    gameAction: 'kill',
                    cardCondition: card => (
                        card.location === 'play area' && 
                        card.controller !== this.controller && 
                        card.getType() === 'character'),
                    onSelect: (player, cards) => this.targetsSelected(player, cards)
                });
            }
        });
    }

    targetsSelected(player, cards) {
        if(this.game.currentChallenge.strengthDifference >= 20 && cards.length !== 3) {
            return false;
        }

        _.each(cards, card => {
            this.game.killCharacter(card);
        });

        this.game.addMessage('{0} plays {1} to kill {2}', this.controller, this, cards);
    }

    hasAttackingFrey() {
        return this.controller.anyCardsInPlay(card => this.game.currentChallenge.isAttacking(card) && 
                                                      card.hasTrait('House Frey') && 
                                                      card.getType() === 'character');
    }
}

FreyHospitality.code = '06079';

module.exports = FreyHospitality;
