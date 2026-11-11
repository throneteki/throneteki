import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class TheDoomOfValyria extends PlotCard {
    // The Doom of Valyria (26100)
    // When Revealed: If there are 3 or more plot cards in your used pile, discard each non-limited
    // card from play, and each card in shadows. An opponent may discard their hand (of at least 3
    // cards) to cancel this effect.
    setupCardAbilities() {
        this.whenRevealed({
            condition: (context) => context.player.getNumberOfUsedPlots() >= 3,
            message:
                '{player} uses {source} to discard all non-limited cards from play, and all cards from shadows',
            gameAction: askToCancel(0)
        });
    }
}

const MaxOpponents = 5;

function cancellingOpponents(context) {
    return context.ability.cannotBeCanceled
        ? []
        : context.game
              .getOpponentsInFirstPlayerOrder(context.player)
              .filter((opponent) => opponent.hand.length >= 3);
}

function askToCancel(index) {
    if (index >= MaxOpponents) {
        return discardFromPlay();
    }

    return GameActions.ifCondition({
        condition: (context) => cancellingOpponents(context).length > index,
        thenAction: GameActions.choose({
            player: (context) => cancellingOpponents(context)[index],
            title: 'Discard hand to cancel?',
            choices: {
                Yes: {
                    message:
                        '{choosingPlayer} discards their hand to cancel the effects of {source}',
                    gameAction: GameActions.simultaneously((context) =>
                        cancellingOpponents(context)[index].hand.map((card) =>
                            GameActions.discardCard({ card, source: context.source })
                        )
                    )
                },
                No: askToCancel(index + 1)
            }
        }),
        elseAction: discardFromPlay()
    });
}

function discardFromPlay() {
    return GameActions.simultaneously((context) =>
        context.game.allCards
            .filter(
                (card) =>
                    (card.location === 'play area' && !card.isLimited()) ||
                    card.location === 'shadows'
            )
            .map((card) => GameActions.discardCard({ card, source: context.source }))
    );
}

TheDoomOfValyria.code = '26100';

export default TheDoomOfValyria;
