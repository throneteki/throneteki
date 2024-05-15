import DrawCard from '../../drawcard.js';

class PoisonedDagger extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current' });
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.parent.isParticipating() &&
                    event.challenge.challengeType === 'intrigue'
            },
            cost: ability.costs.sacrificeSelf(),
            handler: (context) => {
                let otherPlayer = context.event.challenge.loser;
                this.game.promptForSelect(otherPlayer, {
                    cardCondition: (card) =>
                        card.isParticipating() &&
                        card.getType() === 'character' &&
                        card.controller === otherPlayer,
                    activePromptTitle: 'Select character to kill',
                    source: this,
                    gameAction: 'kill',
                    onCancel: (player) => {
                        this.game.addAlert('danger', '{0} cancels resolution of {1}', player, this);

                        return true;
                    },
                    onSelect: (player, card) => {
                        card.controller.killCharacter(card);
                        this.game.addMessage(
                            '{0} uses {1} to force {2} to kill {3}',
                            this.controller,
                            this,
                            otherPlayer,
                            card
                        );

                        return true;
                    }
                });
            }
        });
    }
}

PoisonedDagger.code = '13116';

export default PoisonedDagger;
