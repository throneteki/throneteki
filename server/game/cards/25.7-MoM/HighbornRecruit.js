const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class HighbornRecruit extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character keyword',
            target: {
                cardCondition: { type: 'character', location: 'play area', condition: card => card.getNumberOfIcons() <= 1 }
            },
            cost: ability.costs.kneelSelf(),
            handler: context => {
                context.game.resolveGameAction(GameActions.choose({
                    title: context => `Choose keyword for ${context.target}`,
                    message: {
                        format: '{player} kneels {source} to have {target} gain {keyword} until the end of the phase',
                        args: { keyword: context => context.selectedChoice.text.toLowerCase() }
                    },
                    choices: {
                        'Renown': GameActions.genericHandler(context => this.gainKeyword(context.selectedChoice.text.toLowerCase())),
                        'Insight': GameActions.genericHandler(context => this.gainKeyword(context.selectedChoice.text.toLowerCase()))
                    }
                }), context);
            }
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

HighbornRecruit.code = '25554';
HighbornRecruit.version = '1.0';

module.exports = HighbornRecruit;
