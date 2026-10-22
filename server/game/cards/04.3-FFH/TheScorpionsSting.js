import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheScorpionsSting extends DrawCard {
    // The Scorpion's Sting (04056)
    // Reaction: After you lose a challenge, choose up to X [martell] characters. Each of those
    // characters gains renown until the end of the phase. X is the number of plot cards in your
    // used pile.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.player &&
                    context.player.getNumberOfUsedPlots() >= 1 &&
                    context.game.anyCardsInPlay(
                        (card) => card.isFaction('martell') && card.getType() === 'character'
                    )
            },
            message:
                '{player} plays {source} to give martell characters renown until the end of the phase',
            gameAction: GameActions.chooseCards({
                mode: 'upTo',
                numCards: (context) => context.player.getNumberOfUsedPlots(),
                title: (context) =>
                    `Select up to ${context.player.getNumberOfUsedPlots()} characters`,
                cardCondition: (card) =>
                    card.isFaction('martell') &&
                    card.getType() === 'character' &&
                    card.location === 'play area',
                gameAction: (card) =>
                    GameActions.lastingEffect(() => ({
                        duration: 'untilEndOfPhase',
                        match: card,
                        effect: ability.effects.addKeyword('renown')
                    }))
            })
        });
    }
}

TheScorpionsSting.code = '04056';

export default TheScorpionsSting;
