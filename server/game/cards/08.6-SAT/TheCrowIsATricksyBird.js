import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheCrowIsATricksyBird extends DrawCard {
    // The Crow is a Tricksy Bird (08106)
    // Plot Action: Kneel your faction card to choose an opponent and look at his or her plot deck.
    // Choose 1 plot in that deck. That player must reveal that plot as his or her next plot card,
    // if able.
    setupCardAbilities(ability) {
        this.action({
            title: 'Look at plot deck',
            phase: 'plot',
            chooseOpponent: true,
            cost: ability.costs.kneelFactionCard(),
            message:
                "{player} plays {source} and kneels their faction card to look at {opponent}'s plot deck",
            gameAction: GameActions.chooseCards({
                title: 'Select a plot',
                revealTargets: true,
                cardCondition: (card, context) => context.opponent.getPlots().includes(card),
                gameAction: (card, context) =>
                    GameActions.lastingEffect(() => ({
                        duration: 'custom',
                        until: {
                            onCardEntersPlay: (event) =>
                                event.card.getType() === 'plot' &&
                                event.card.controller === context.opponent
                        },
                        targetController: 'any',
                        match: (player) => player === context.opponent,
                        effect: ability.effects.mustRevealPlot(card)
                    }))
            })
        });
    }
}

TheCrowIsATricksyBird.code = '08106';

export default TheCrowIsATricksyBird;
