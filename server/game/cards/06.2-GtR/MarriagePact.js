import DrawCard from '../../drawcard.js';

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
                onCardLeftPlay: (event) => event.card === this.parent
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                context.target.controller.sacrificeCard(context.target);
                this.game.addMessage(
                    '{0} is forced by {1} to sacrifice {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

MarriagePact.code = '06022';

export default MarriagePact;
