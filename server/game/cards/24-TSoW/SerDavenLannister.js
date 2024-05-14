const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class SerDavenLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event, context) =>
                    event.card === this &&
                    // TODO strictly speaking this check should not be done in the 'when' condition, but when checking targets
                    // SEE ALSO GreatWyk (12017), which have the same triggering restriction (not implemented yet)
                    context.game
                        .getOpponents(context.player)
                        .every((opponent) => opponent.hand.length > 0)
            },
            message:
                '{player} uses {source} to have each opponent choose and discard 1 card from their hand',
            limit: ability.limit.perRound(2),
            gameAction: GameActions.simultaneously((context) =>
                context.game.getOpponents(context.player).map((opponent) =>
                    GameActions.genericHandler((context) => {
                        this.game.promptForSelect(opponent, {
                            source: this,
                            activePrompt: 'Select a card',
                            cardCondition: (card) =>
                                card.controller === opponent && card.location === 'hand',
                            onSelect: (player, card) => this.onCardSelected(context, player, card),
                            onCancel: (player) => this.onCancel(player)
                        });
                    })
                )
            ).then({
                condition: (context) =>
                    context.game
                        .getOpponents(context.player)
                        .every((opponent) => opponent.hand.length < context.player.hand.length),
                message: 'Then, {player} draws 1 card',
                gameAction: GameActions.drawCards((context) => ({
                    amount: 1,
                    player: context.player
                }))
            })
        });
    }

    onCardSelected(context, player, card) {
        this.game.addMessage('{0} discards {1} from their hand', player, card);
        context.game.resolveGameAction(GameActions.discardCard({ card }), context);

        return true;
    }

    onCancel(player) {
        this.game.addAlert('danger', '{0} did not select a card to discard for {1}', player, this);

        return true;
    }
}

SerDavenLannister.code = '24007';

module.exports = SerDavenLannister;
