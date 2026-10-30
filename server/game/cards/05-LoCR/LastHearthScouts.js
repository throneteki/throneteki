import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LastHearthScouts extends DrawCard {
    // Last Hearth Scouts (05034)
    // Forced Reaction: After a character enters play during the challenges phase, kneel that
    // character.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    context.game.currentPhase === 'challenge' &&
                    event.card.getType() === 'character'
            },
            message: {
                format: '{player} is forced by {source} to kneel {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.kneelCard((context) => ({ card: context.event.card }))
        });
    }
}

LastHearthScouts.code = '05034';

export default LastHearthScouts;
