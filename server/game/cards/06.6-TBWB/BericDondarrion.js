import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class BericDondarrion extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.tokens[Tokens.kiss])
        });

        this.forcedReaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
            },
            cannotBeCanceled: true,
            message: '{player} is forced to place 6 kiss tokens on {source}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.placeToken(() => ({ card: this, token: Tokens.kiss, amount: 6 })),
                    context
                );
            }
        });

        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave && event.card === this && this.canBeSaved()
            },
            cost: ability.costs.discardTokenFromSelf(Tokens.kiss),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} discards a kiss token to save {1}',
                    this.controller,
                    this
                );
            }
        });
    }
}

BericDondarrion.code = '06117';

export default BericDondarrion;
