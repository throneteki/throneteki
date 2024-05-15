import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheBloodyCup extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({ winner: this.controller, unopposed: true })
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.event.challenge.loser &&
                    GameActions.returnCardToDeck({ card }).allow()
            },
            message: {
                format: "{player} plays {source} to place {target} on top of {loser}'s deck",
                args: { loser: (context) => context.event.challenge.loser }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnCardToDeck((context) => ({
                        card: context.target
                    })),
                    context
                );
            },
            max: ability.limit.perChallenge(1)
        });
    }
}

TheBloodyCup.code = '13092';

export default TheBloodyCup;
