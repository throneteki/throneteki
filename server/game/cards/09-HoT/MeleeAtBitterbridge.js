import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class MeleeAtBitterbridge extends DrawCard {
    // Melee at Bitterbridge (09022)
    // Action: Choose X participating characters. Each character with the highest STR among those
    // characters gains renown until the end of the challenge. Each other chosen character does not
    // contribute its STR to the challenge.
    setupCardAbilities(ability) {
        this.xValue({
            min: () => 1,
            max: (context) => context.game.currentChallenge.getNumberOfParticipants()
        });
        this.action({
            title: 'Give character renown',
            condition: (context) =>
                context.game.currentChallenge &&
                context.game.currentChallenge.getNumberOfParticipants() > 0,
            message: {
                format: '{player} plays {source} and pays {amount} gold to choose {characters}',
                args: {
                    amount: (context) => context.xValue,
                    characters: (context) =>
                        TextHelper.count(context.xValue, 'participating character')
                }
            },
            gameAction: GameActions.chooseCards({
                mode: 'exactly',
                numCards: (context) => context.xValue,
                title: (context) => `Select ${TextHelper.count(context.xValue, 'character')}`,
                cardCondition: (card) => card.location === 'play area' && card.isParticipating(),
                gameAction: (card, context) =>
                    GameActions.lastingEffect(() => ({
                        duration: 'untilEndOfChallenge',
                        match: card,
                        targetController: 'any',
                        effect: hasHighestStrength(card, context.chosenCards)
                            ? ability.effects.addKeyword('renown')
                            : ability.effects.doesNotContributeStrength()
                    }))
            })
        });
    }
}

function hasHighestStrength(card, chosenCards) {
    return card.getStrength() === Math.max(...chosenCards.map((chosen) => chosen.getStrength()));
}

MeleeAtBitterbridge.code = '09022';

export default MeleeAtBitterbridge;
