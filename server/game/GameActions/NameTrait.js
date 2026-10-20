import AbilityMessage from '../AbilityMessage.js';
import GameAction from './GameAction.js';

class NameTrait extends GameAction {
    constructor({ player, title = 'Name a trait', message, gameAction }) {
        super('nameTrait');

        this.playerFunc = player || ((context) => context.player);
        this.title = title;
        this.abilityMessage = AbilityMessage.create(message, {
            trait: (context) => context.namedTrait
        });
        this.gameAction = gameAction;
    }

    allow() {
        return true;
    }

    createEvent(context) {
        const player = this.playerFunc(context);

        return this.event('onTraitNamed', { player }, (event) => {
            context.game.promptWithMenu(
                player,
                {
                    selectTraitName: (selectingPlayer, trait) => {
                        context.namedTrait = trait;
                        event.trait = trait;
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
                            { type: 'trait-name', command: 'menuButton', method: 'selectTraitName' }
                        ]
                    },
                    source: context.source
                }
            );
        });
    }
}

export default NameTrait;
