import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class YouMurderedHerChildren extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        loser: this.controller,
                        defendingPlayer: this.controller
                    })
            },
            target: {
                cardCondition: { location: 'play area', type: 'character', attacking: true },
                gameAction: 'discard'
            },
            message: '{player} plays {source} to discard {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.discardCard((context) => ({
                        card: context.target,
                        allowSave: false
                    })).then((context) => ({
                        gameAction: GameActions.search({
                            title: 'Select characters',
                            searchedPlayer: () => context.event.challenge.attackingPlayer,
                            location: ['draw deck', 'hand'],
                            match: { name: context.target.name },
                            numToSelect: 2,
                            message: {
                                format: "Then {player} searches {attackingPlayer}'s hand and deck to discard {searchTarget}",
                                args: {
                                    attackingPlayer: (thenContext) =>
                                        thenContext.parentContext.event.challenge.attackingPlayer
                                }
                            },
                            gameAction: GameActions.simultaneously((thenContext) =>
                                thenContext.searchTarget.map((card) =>
                                    GameActions.discardCard({ card })
                                )
                            )
                        })
                    })),
                    context
                );
            }
        });
    }
}

YouMurderedHerChildren.code = '16008';

export default YouMurderedHerChildren;
