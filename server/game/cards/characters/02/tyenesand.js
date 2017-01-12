const DrawCard = require('../../../drawcard.js');

class TyeneSand extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.challengeType === 'intrigue' &&
                    challenge.winner === this.controller &&
                    challenge.isAttacking(this)
                )
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character' && !card.hasIcon('intrigue'),
                    onSelect: (p, card) => {
                        this.atEndOfPhase(ability => ({
                            match: card,
                            effect: ability.effects.poison
                        }));
                        return true;
                    }
                });
            }
        })
    }
}

TyeneSand.code = '02115';

module.exports = TyeneSand;
