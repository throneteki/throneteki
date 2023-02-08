const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class SerDavenLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({
                    winner: this.controller,
                    challengeType: 'power',
                    match: challenge => challenge.anyParticipants(card => card.controller === this.controller && card.hasTrait('Army'))
                })
            },
            cost: ability.costs.discardAnyPower(card => card === this),
            message: {
                format: '{player} discards {costs.discardPower} power from {source} to discard {costs.discardPower} card(s) from {loser}\'s hand and draw {costs.discardPower} card(s)',
                args: { loser: context => context.event.challenge.loser }
            },
            gameAction: GameActions.simultaneously(context => [
                GameActions.discardAtRandom({ amount: context.costs.discardPower, player: context.event.challenge.loser }),
                GameActions.drawCards({ amount: context.costs.discardPower, player: context.player })
            ])
        });
    }
}

SerDavenLannister.code = '24007';

module.exports = SerDavenLannister;
