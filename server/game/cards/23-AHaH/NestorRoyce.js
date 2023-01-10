const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class NestorRoyce extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => this.isAttacking() && event.challenge.isMatch({ winner: this.controller })
            },
            cost: ability.costs.kneel({ type: 'location', faction: 'neutral', printedCostOrHigher: 1 }),
            message: '{player} uses {source} and kneels {costs.kneel} to give {source} renown or intimidate',
            gameAction: GameActions.choose({
                title: context => `Choose keyword for ${context.source.name}`,
                message: {
                    format: '{player} chooses to have {source} gain {keyword} until the end of the challenge',
                    args: { keyword: context => context.selectedChoice.text.toLowerCase() }
                },
                choices: {
                    'Renown': GameActions.genericHandler(context => this.gainKeyword(context.selectedChoice.text.toLowerCase())),
                    'Intimidate': GameActions.genericHandler(context => this.gainKeyword(context.selectedChoice.text.toLowerCase()))
                }
            })
        });
    }

    gainKeyword(keyword) {
        this.untilEndOfChallenge(ability => ({
            match: this,
            effect: ability.effects.addKeyword(keyword)
        }));
        return true;
    }
}

NestorRoyce.code = '23023';

module.exports = NestorRoyce;
