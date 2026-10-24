import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class BericDondarrion extends DrawCard {
    // Beric Dondarrion (06117)
    // Renown.
    // X is the number of kiss tokens Beric Dondarrion has.
    // Forced Reaction: After you marshal Beric Dondarrion, place 6 kiss tokens on him. (Cannot be
    // canceled.)
    // Interrupt: When Beric Dondarrion would be killed, discard a kiss token from him to save him.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card === context.source,
            effect: ability.effects.dynamicStrength((card) => card.tokens[Tokens.kiss])
        });
        this.forcedReaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && event.playingType === 'marshal'
            },
            cannotBeCanceled: true,
            message: '{player} is forced to place 6 kiss tokens on {source}',
            gameAction: GameActions.placeToken((context) => ({
                card: context.source,
                token: Tokens.kiss,
                amount: 6
            }))
        });
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.allowSave && event.card === context.source && event.card.canBeSaved()
            },
            cost: ability.costs.discardTokenFromSelf(Tokens.kiss),
            message: '{player} discards a kiss token to save {source}',
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

BericDondarrion.code = '06117';

export default BericDondarrion;
