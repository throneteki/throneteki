import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LordProtectorOfTheVale extends DrawCard {
    // Lord Protector of the Vale (23035)
    // Lord character you control only.
    // If attached character is Littlefinger, he gets +2 STR.
    // Challenges Action: During a [power] challenge in which you control a participating House
    // Arryn character, kneel Lord Protector of the Vale to have attached character contribute its
    // STR to your side this challenge.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lord', controller: 'current' });

        this.whileAttached({
            match: (card) => card.name === 'Littlefinger',
            effect: ability.effects.modifyStrength(2)
        });

        this.action({
            title: 'Contribute attached STR',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            condition: (context) =>
                context.game.isDuringChallenge() &&
                context.game.currentChallenge.challengeType === 'power' &&
                context.source.controller.anyCardsInPlay({
                    trait: 'House Arryn',
                    type: 'character',
                    participating: true
                }),
            message: {
                format: "{player} kneels {source} to have {parent} contribute its STR (currently {str}) to {player}'s side of the challenge",
                args: {
                    parent: (context) => context.source.parent,
                    str: (context) => context.source.parent.getStrength()
                }
            },
            gameAction: GameActions.genericHandler((context) => {
                context.source.untilEndOfChallenge((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.contributeCharacterStrength(context.source.parent)
                }));
            })
        });
    }
}

LordProtectorOfTheVale.code = '23035';

export default LordProtectorOfTheVale;
