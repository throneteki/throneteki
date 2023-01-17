const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class LordProtectorOfTheVale extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lord', controller: 'current' });

        this.whileAttached({
            match: card => card.name === 'Littlefinger',
            effect: ability.effects.modifyStrength(2)
        });

        this.action({
            title: 'Contribute attached STR',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            condition: () => this.game.isDuringChallenge()
                && this.game.currentChallenge.challengeType === 'power'
                && this.controller.anyCardsInPlay({ trait: 'House Arryn', type: 'character', participating: true }),
            message: {
                format: '{player} kneels {source} to have {parent} contribute its STR (currently {str}) to {player}\'s side of the challenge',
                args: {
                    parent: () => this.parent,
                    str: () => this.parent.getStrength()
                }
            },
            gameAction: GameActions.genericHandler(() => {
                this.untilEndOfChallenge(ability => ({
                    targetController: 'current',
                    effect: ability.effects.contributeCharacterStrength(this.parent)
                }));
            })
        });
    }
}

LordProtectorOfTheVale.code = '23035';

module.exports = LordProtectorOfTheVale;
