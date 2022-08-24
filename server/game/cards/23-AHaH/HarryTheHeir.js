const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class HarryTheHeir extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'Anya Waynwood' && card.controller === this.controller,
            effect: ability.effects.dynamicStrength(() => this.power)
        });

        this.reaction({
            when: {
                afterChallenge: event => this.isAttacking() && event.challenge.isMatch({ winner: this.controller })
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: { location: 'play area', kneeled: true, type: 'location', faction: 'neutral', controller: 'current' }
            },
            message:'{player} uses {source} to stand {target}',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.standCard(context => ({
                        card: context.target
                    })),
                    context
                );
            },
            limit: ability.limit.perRound(1)
        });
    }
}

HarryTheHeir.code = '23022';

module.exports = HarryTheHeir;
