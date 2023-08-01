const DrawCard = require('../../drawcard.js');

class SchemingSnake extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            target: {
                cardCondition: card => card.isParticipating() && card.getType() === 'character' && card.getNumberOfIcons() < 2
            },
            message: '{player} uses {source} to have {target} not contribute it\'s STR to this challenge',
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.doesNotContributeStrength()
                }));
            }
        });
    }
}

SchemingSnake.code = '25541';
SchemingSnake.version = '1.0';

module.exports = SchemingSnake;
