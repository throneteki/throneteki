import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheStallionWhoMountsTheWorld extends DrawCard {
    // The Stallion Who Mounts the World (26114)
    // Reaction: After you win a [power] challenge as the attacking player, kneel your faction card
    // to search your deck for a Dothraki character and put it into play. Shuffle your deck. The
    // defending player may kill 2 characters to cancel this effect.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'power' &&
                    event.challenge.winner === context.player &&
                    event.challenge.attackingPlayer === context.player
            },
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} plays {source} and kneels their faction card to search their deck for a Dothraki character',
            gameAction: GameActions.ifCondition({
                condition: (context) =>
                    context.ability.cannotBeCanceled ||
                    context.event.challenge.loser.getNumberOfCardsInPlay({
                        type: 'character',
                        cardCondition: (card) => GameActions.kill({ card }).allow()
                    }) < 2,
                thenAction: searchForDothraki(),
                elseAction: GameActions.choose({
                    player: (context) => context.event.challenge.loser,
                    choices: {
                        'Allow search': {
                            message: '{choosingPlayer} chooses to allow the deck search',
                            gameAction: searchForDothraki()
                        },
                        'Kill 2 characters': {
                            message:
                                '{choosingPlayer} chooses to kill 2 characters to cancel {source}',
                            gameAction: GameActions.chooseCards({
                                player: (context) => context.event.challenge.loser,
                                mode: 'exactly',
                                numCards: 2,
                                title: 'Select two characters',
                                cardCondition: (card, context) =>
                                    card.getType() === 'character' &&
                                    card.location === 'play area' &&
                                    card.controller === context.choosingPlayer,
                                gameAction: (card) => GameActions.kill({ card })
                            })
                        }
                    }
                })
            })
        });
    }
}

function searchForDothraki() {
    return GameActions.search({
        title: 'Select a character',
        match: { trait: 'Dothraki', type: 'character' },
        message: '{player} puts {searchTarget} into play',
        gameAction: GameActions.putIntoPlay((context) => ({
            card: context.searchTarget
        }))
    });
}

TheStallionWhoMountsTheWorld.code = '26114';

export default TheStallionWhoMountsTheWorld;
