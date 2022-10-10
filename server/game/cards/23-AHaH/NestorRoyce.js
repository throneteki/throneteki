const DrawCard = require('../../drawcard');

class NestorRoyce extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => this.isAttacking() && event.challenge.isMatch({ winner: this.controller })
            },
            cost: ability.costs.kneel({ type: 'location', faction: 'neutral', printedCostOrHigher: 1 }),
            message: {
                format: '{player} uses {source} and kneels {kneel} to give {source} a keyword',
                args: { kneel: context => context.costs.kneel }
            },
            handler: context => {
                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: `Gain keyword for ${context.source.name}`,
                        buttons: [
                            { text: 'Renown', arg: 'renown', method: 'gainKeyword' },
                            { text: 'Intimidate', arg: 'intimidate', method: 'gainKeyword' }
                        ]
                    },
                    source: context.source
                });
            }
        });
    }

    gainKeyword(player, keyword) {
        this.game.addMessage('{0} gains {1}', this, keyword);
        this.untilEndOfChallenge(ability => ({
            match: this,
            effect: ability.effects.addKeyword(keyword)
        }));
        return true;
    }
}

NestorRoyce.code = '23024';

module.exports = NestorRoyce;
