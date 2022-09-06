const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');
const {flatten} = require('../../../Array');

class AWallOfRoses extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: event => event.challenge.initiatedAgainstPlayer === this.controller
            },
            message: '{player} plays {source} to reveal their hand',
            gameAction: GameActions.revealCards(context => ({
                cards: context.player.hand
            })).then({
                message: 'Then, {player} stands and removes {attackers} from the challenge',
                gameActions: GameActions.simultaneously(context => 
                    flatten(context.event.challenge.attackers.map(attacker => [GameActions.standCard({ card: attacker }), GameActions.removeFromChallenge({ card: attacker })]))
                )
            })
        });
    }
}

AWallOfRoses.code = '23016';

module.exports = AWallOfRoses;
