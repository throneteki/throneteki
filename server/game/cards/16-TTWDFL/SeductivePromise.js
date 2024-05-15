import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SeductivePromise extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        winner: this.controller,
                        challengeType: 'power',
                        by5: true
                    })
            },
            target: {
                cardCondition: (card, context) =>
                    card.isMatch({ location: 'play area', type: 'character', unique: false }) &&
                    card.controller === context.event.challenge.loser
            },
            message: '{player} plays {source} to take control of {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.takeControl((context) => ({
                        player: context.player,
                        card: context.target
                    })),
                    context
                );
            },
            max: ability.limit.perChallenge(1)
        });
    }
}

SeductivePromise.code = '16025';

export default SeductivePromise;
