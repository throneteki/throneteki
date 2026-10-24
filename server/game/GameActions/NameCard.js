import AbilityMessage from '../AbilityMessage.js';
import GameAction from './GameAction.js';

class NameCard extends GameAction {
    constructor({
        player,
        title = 'Name a card',
        match = () => true,
        message,
        gameAction,
        remember = false
    }) {
        super('nameCard');

        this.playerFunc = player || ((context) => context.player);
        this.title = title;
        this.match = match;
        this.abilityMessage = AbilityMessage.create(message, {
            cardName: (context) => context.namedCard
        });
        this.gameAction = gameAction;
        this.remember = remember;
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
                        if (!isCardName(context.game, cardName, this.match, context)) {
                            return false;
                        }

                        context.namedCard = cardName;
                        if (this.remember) {
                            context.source.namedCard = cardName;
                        }
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

function isCardName(game, cardName, match, context) {
    return Object.values(game.cardData).some(
        (card) =>
            card.name && card.name.toLowerCase() === cardName.toLowerCase() && match(card, context)
    );
}

export default NameCard;
