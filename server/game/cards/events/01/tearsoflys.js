const DrawCard = require('../../../drawcard.js');

class TearsOfLys extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.attackingPlayer === this.controller &&
                    challenge.winner === this.controller &&
                    challenge.challengeType === 'intrigue'
                )
            },
            handler: () => {
                // Use an explicit prompt instead of the target API because the
                // card uses the word 'place' instead of 'choose'.
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character to receive poison token',
                    source: this,
                    cardCondition: card => card.location === 'play area' && card.controller !== this.controller && card.getType() === 'character' && !card.hasIcon('intrigue'),
                    onSelect: (p, card) => this.cardSelected(card)
                });
            }
        });
    }

    cardSelected(card) {
        this.atEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.poison
        }));
        return true;
    }
}

TearsOfLys.code = '01044';

module.exports = TearsOfLys;
