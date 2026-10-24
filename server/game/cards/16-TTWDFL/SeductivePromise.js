import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SeductivePromise extends DrawCard {
    // Seductive Promise (16025)
    // Reaction: After you win a [power] challenge by 5 or more STR, choose a non-unique character
    // controlled by the losing opponent. Take control of that character. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.source.controller,
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
            gameAction: GameActions.takeControl((context) => ({
                player: context.player,
                card: context.target
            })),
            max: ability.limit.perChallenge(1)
        });
    }
}

SeductivePromise.code = '16025';

export default SeductivePromise;
