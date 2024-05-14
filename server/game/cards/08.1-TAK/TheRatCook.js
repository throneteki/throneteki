import DrawCard from '../../drawcard.js';

class TheRatCook extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Blank and take control of character',
            phase: 'marshal',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= this.getNumberOfStewards()
            },
            handler: (context) => {
                this.untilEndOfRound((ability) => ({
                    match: context.target,
                    effect: [
                        ability.effects.takeControl(this.controller),
                        ability.effects.blankExcludingTraits
                    ]
                }));

                this.game.addMessage(
                    '{0} plays {1} to blank and take control of {2} until the end of the round',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }

    getNumberOfStewards() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait('Steward')
        );
    }
}

TheRatCook.code = '08007';

export default TheRatCook;
