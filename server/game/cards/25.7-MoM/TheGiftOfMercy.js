const AgendaCard = require('../../agendacard');
const GameActions = require('../../GameActions');
const { Tokens } = require('../../Constants');

class TheGiftOfMercy extends AgendaCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onTargetsChosen: event => (
                    event.ability.isTriggeredAbility() &&
                    event.targets.hasSingleTarget() &&
                    event.targets.anySelection(selection => (
                        selection.choosingPlayer === this.controller &&
                        selection.value.getType() === 'character'
                    ))
                )
            },
            message: {
                format: '{player} uses {source} to place 1 Valar Morghulis token on {card}',
                args: { card: context => context.event.targets.getTargets()[0] }
            },
            gameAction: GameActions.placeToken(context => ({
                card: context.event.targets.getTargets()[0],
                token: Tokens.valarmorghulis
            })),
            limit: ability.limit.perPhase(1)
        });

        const playersThatDoNotControlCard = context => context.game.getPlayers().filter(player => player !== context.event.card.controller);
        this.forcedInterrupt({
            when: {
                onCardLeftPlay: event => event.card.getType() === 'character' && event.card.hasToken(Tokens.valarmorghulis)
            },
            message: {
                format: '{player} is forced by {source} to have {gainingPlayers} to gain {amount} power',
                args: { gainingPlayers: playersThatDoNotControlCard, amount: context => context.event.card.tokens[Tokens.valarmorghulis] }
            },
            gameAction: GameActions.simultaneously(context => playersThatDoNotControlCard(context).map(player => (
                GameActions.gainPower({
                    amount: context.event.card.tokens[Tokens.valarmorghulis],
                    card: player.faction
                })
            )))
        });
    }
}

TheGiftOfMercy.code = '25618';
TheGiftOfMercy.version = '1.0';

module.exports = TheGiftOfMercy;
