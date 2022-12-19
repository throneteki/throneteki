const DrawCard = require('../../drawcard.js');

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
                format: '{player} kneels {source} to have {parent} contribute its STR (currently {STR}) to {player}\'s side this challenge',
                args: { 
                    parent: () => this.parent,
                    STR: () => this.parent.getStrength()
                }
            },
            handler: () => {
                this.untilEndOfChallenge(ability => ({
                    condition: () => true,
                    targetController: 'current',
                    effect: ability.effects.contributeChallengeStrength(this.parent)
                }));
            }
        });
    }
}

LordProtectorOfTheVale.code = '23035';

module.exports = LordProtectorOfTheVale;
