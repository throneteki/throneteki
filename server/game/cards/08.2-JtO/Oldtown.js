const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Oldtown extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top card of deck',
            cost: ability.costs.kneelSelf(),
            message: '{player} uses and kneels {source} to name a cardtype',
            handler: context => {
                this.context = context;

                let cardTypes = ['Character', 'Location', 'Attachment', 'Event'];

                let buttons = cardTypes.map(cardType => {
                    return { text: cardType, method: 'cardTypeSelected', arg: cardType.toLowerCase() };
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a card type',
                        buttons: buttons
                    },
                    source: context.source
                });
            }
        });
    }

    cardTypeSelected(player, cardType) {
        this.game.addMessage('{0} names the {1} cardtype', this.context.player, cardType);

        const revealAction = GameActions.revealTopCards(context => ({
            player: context.player
        })).then({
            message: '{player} {gameAction}',
            gameAction: GameActions.ifCondition({
                condition: context => context.event.cards[0].getType() === cardType,
                thenAction: GameActions.simultaneously([
                    GameActions.drawCards(context => ({
                        player: context.player,
                        amount: 1
                    })),
                    GameActions.gainPower(context => ({
                        card: context.player.faction,
                        amount: 1
                    }))
                ])
            })
        });

        this.game.addMessage('Then {0} reveals the top card of their deck', this.context.player);
        this.game.resolveGameAction(revealAction, this.context);

        return true;
    }
}

Oldtown.code = '08024';

module.exports = Oldtown;
