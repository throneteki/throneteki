import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RamsaySnow extends DrawCard {
    // Ramsay Snow (08041)
    // Forced Reaction: After Ramsay Snow enters play, each player sacrifices a character, if able.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'character',
                gameAction: GameActions.sacrificeCard((context) => ({
                    card: context.target,
                    player: context.target.controller
                }))
            }
        });
    }
}

RamsaySnow.code = '08041';

export default RamsaySnow;
