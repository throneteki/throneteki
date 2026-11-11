import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LadyInWaiting extends DrawCard {
    // Lady-in-Waiting (02023)
    // Lady-in-Waiting may be marshaled as a duplicate (at no cost) on a Lady character you own and
    // control.
    setupCardAbilities() {
        this.playAction({
            title: 'Marshal as dupe',
            condition: (context) =>
                context.game.currentPhase === 'marshal' &&
                context.player.canPutIntoPlay(context.source, 'marshal') &&
                context.player.isCardInPlayableLocation(context.source, 'marshal') &&
                context.player.allowMarshal,
            cannotBeCanceled: true,
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Lady') &&
                    card.controller === context.player &&
                    card.owner === context.player
            },
            message: '{player} marshals {source} as a duplicate on {target} for free',
            gameAction: GameActions.marshalAsDuplicate((context) => ({
                card: context.source,
                parent: context.target,
                player: context.player
            }))
        });
    }
}

LadyInWaiting.code = '02023';

export default LadyInWaiting;
