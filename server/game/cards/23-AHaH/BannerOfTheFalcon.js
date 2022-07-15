const AgendaCard = require('../../agendacard');
const GameActions = require('../../GameActions');

class BannerOfTheFalcon extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.game.isDuringChallenge({
                attackingPlayer: this.controller,
                match: challenge => challenge.attackers.some(attacker => attacker.hasTrait('House Arryn'))
            }),
            match: card => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(-1)
        });

        // TODO: If a limit is introduced on this card, it will need to be combined into a proper, single reaction
        // instead of 3 "separate" reactions.
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ winner: this.controller, by5: true, challengeType: 'military' })
            },
            target: {
                cardCondition: card => card.isParticipating(),
                gameAction: 'gainPower'
            },
            message: '{player} uses {source} to have {target} gain 1 power',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.gainPower(context => ({
                        card: context.target,
                        amount: 1
                    })),
                    context
                );
            }
        });

        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ winner: this.controller, by5: true, challengeType: 'intrigue' })
            },
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards(context => ({
                player: context.player,
                amount: 1
            }))
        });

        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ winner: this.controller, by5: true, challengeType: 'power' })
            },
            target: {
                cardCondition: card => card.isParticipating() && card.kneeled,
                gameAction: 'stand'
            },
            message: '{player} uses {source} to stand {target}',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.standCard(context => ({
                        card: context.target
                    })),
                    context
                );
            }
        });
    }
}

BannerOfTheFalcon.code = '23040';

module.exports = BannerOfTheFalcon;
