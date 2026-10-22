import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MarriagePact extends DrawCard {
    // Marriage Pact (06022)
    // Terminal.
    // Attached character cannot participate in challenges against you.
    // Forced Interrupt: When attached character leaves play, sacrifice a character you control.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cannotParticipate()
        });

        this.forcedInterrupt({
            when: {
                onCardLeftPlay: (event, context) => event.card === context.source.parent
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.source.controller &&
                    card.getType() === 'character'
            },
            message: '{player} is forced by {source} to sacrifice {target}',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.target }))
        });
    }
}

MarriagePact.code = '06022';

export default MarriagePact;
