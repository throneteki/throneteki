import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ALionStillHasClaws extends DrawCard {
    // "A Lion Still Has Claws" (20014)
    // Reduce the cost to play "A Lion Still Has Claws" by 1 for each Scheme plot card revealed.
    // Reaction: After you win an [intrigue] challenge by 5 or more STR, choose a Trait. Return each
    // character with that Trait and printed cost X or lower to its owner’s hand.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: (context) => context.game.anyPlotHasTrait('Scheme'),
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('play', (card) =>
                numOfSchemePlotsRevealed(card.game)
            )
        });
        this.xValue({ min: () => 0, max: () => 99 });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.player,
                        challengeType: 'intrigue',
                        by5: true
                    })
            },
            gameAction: GameActions.nameTrait({
                message:
                    "{player} plays {source} to return each {trait} character to its owner's hand",
                gameAction: GameActions.simultaneously((context) =>
                    context.game
                        .filterCardsInPlay(
                            (card) =>
                                card.getType() === 'character' &&
                                card.hasTrait(context.namedTrait) &&
                                card.getPrintedCost() <= context.xValue
                        )
                        .map((card) => GameActions.returnCardToHand({ card }))
                )
            })
        });
    }
}

function numOfSchemePlotsRevealed(game) {
    return game
        .getPlayers()
        .filter((player) => player.activePlot && player.activePlot.hasTrait('Scheme')).length;
}

ALionStillHasClaws.code = '20014';

export default ALionStillHasClaws;
