const DrawCard = require('../../../drawcard.js');

class OlennasInformant extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (e, card) => card === this && this.game.currentPhase === 'challenge'
            },
            handler: () => {
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Name a challenge type',
                        buttons: [
                            { text: 'Military', method: 'challengeSelected', arg: 'military' },
                            { text: 'Intrigue', method: 'challengeSelected', arg: 'intrigue' },
                            { text: 'Power', method: 'challengeSelected', arg: 'power' }
                        ]
                    },
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name
                });
            }
        });
    }

    challengeSelected(player, challenge) {
        this.untilEndOfPhase(ability => ({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.modifyChallengeTypeLimit(challenge, 1)
        }));

        this.game.addMessage('{0} uses {1} to be able to initiate an additional {2} challenge this phase', player, this, challenge);

        return true;
    } 
}

OlennasInformant.code = '01189';

module.exports = OlennasInformant;
