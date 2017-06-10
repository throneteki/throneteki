const DrawCard = require('../../../drawcard.js');

class DragonSight extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce non-Dragon characters STR by 1',
            condition: () => this.game.currentChallenge,
            handler: () => {
                this.game.addMessage('{0} use {1} to give each non-Dragon participating character -1 STR until the end of the challenge', this.controller, this);
                this.untilEndOfChallenge(ability => ({
                    match: card => (
                        card.getType() === 'character' &&
                        !card.hasTrait('Dragon') &&
                        this.game.currentChallenge.isParticipating(card)
                    ),
                    targetController: 'any',
                    effect: ability.effects.modifyStrength(-1)
                }));
            }
        });
    }
}

DragonSight.code = '03036';

module.exports = DragonSight;
