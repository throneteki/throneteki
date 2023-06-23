const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Drogon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Stormborn'),
            effect: ability.effects.addKeyword('Renown')
        });

        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.isAttacking()
            },
            message: {
                format: '{player} uses {source} to kill all characters {defendingPlayer} controls with STR 1 or lower',
                args: { defendingPlayer: context => context.event.challenge.defendingPlayer }
            },
            gameAction: GameActions.simultaneously(context =>
                context.event.challenge.defendingPlayer.filterCardsInPlay({
                    type: 'character', printedStrengthOrLower: 1
                }).map((card) => GameActions.kill({card: card}))
            )
        });
    }
}

Drogon.code = '15002';

module.exports = Drogon;
