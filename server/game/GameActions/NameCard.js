import AbilityMessage from '../AbilityMessage.js';
import GameAction from './GameAction.js';

class NameCard extends GameAction {
    constructor({ player, title = 'Name a card', message, gameAction }) {
        super('nameCard');

        this.playerFunc = player || ((context) => context.player);
        this.title = title;
        this.abilityMessage = AbilityMessage.create(message, {
            cardName: (context) => context.namedCard
        });
        this.gameAction = gameAction;
    }

    allow() {
        return true;
    }

    logsOwnMessage() {
        return true;
    }

    createEvent(context) {
        const player = this.playerFunc(context);

        return this.event('onCardNamed', { player }, (event) => {
            context.game.promptWithMenu(
                player,
                {
                    selectCardName: (selectingPlayer, cardName) => {
                        if (!isCardName(context.game, cardName)) {
                            return false;
                        }

                        context.namedCard = cardName;
                        event.cardName = cardName;
                        this.abilityMessage.output(context.game, context);
                        if (this.gameAction && this.gameAction.allow(context)) {
                            event.thenAttachEvent(this.gameAction.createEvent(context));
                        }
                        return true;
                    }
                },
                {
                    activePrompt: {
                        menuTitle: this.title,
                        controls: [
                            { type: 'card-name', command: 'menuButton', method: 'selectCardName' }
                        ]
                    },
                    source: context.source
                }
            );
        });
    }
}

function isCardName(game, cardName) {
    return Object.values(game.cardData).some(
        (card) => card.name && card.name.toLowerCase() === cardName.toLowerCase()
    );
}

export default NameCard;
