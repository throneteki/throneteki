const DrawCard = require('../../../drawcard.js');

class Spearmaiden extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onAttackersDeclared: (event, challenge) => challenge.challengeType === 'military' && challenge.isAttacking(this)
            },
            target: {
                activePromptTitle: 'Select character',
                cardCondition: card => (
                    card.location === 'play area' &&
                    card.controller !== this.controller &&
                    card.getType() === 'character')
            },
            handler: context => {
                this.game.addMessage('{0} chooses {1} as the target for {2}', this.controller, context.target, this);

                this.game.once('afterChallenge', (event, challenge) => this.resolveIfWinBy5(challenge, context));
            }
        });
    }

    resolveIfWinBy5(challenge, context) {
        if(challenge.winner !== this.controller || challenge.strengthDifference < 5) {
            return;
        }

        this.game.addMessage('{0} uses {1} to force {2} to be chosen for claim, if able', this.controller, this, context.target);

        this.untilEndOfChallenge(ability => ({
            targetType: 'player',
            targetController: 'opponent',
            effect: ability.effects.mustChooseAsClaim(context.target)
        }));
    }
}

Spearmaiden.code = '04055';

module.exports = Spearmaiden;
