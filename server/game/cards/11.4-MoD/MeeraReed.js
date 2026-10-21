import DrawCard from '../../drawcard.js';

class MeeraReed extends DrawCard {
    // Meera Reed (11061)
    // Shadow (1). Stealth.
    // Reaction: After a [stark] character you control is sacrificed, return Meera Reed to shadows.
    // Reaction: After Meera Reed comes out of shadows, choose a character. Until the end of the
    // phase, treat it as if its printed text box were blank (except for Traits).
    setupCardAbilities() {
        this.reaction({
            when: {
                onSacrificed: (event) =>
                    this.isControlledStarkCharacter(event.cardStateWhenSacrificed)
            },
            handler: (context) => {
                this.game.addMessage('{0} uses {1} to return {1} to shadows', context.player, this);
                context.player.putIntoShadows(this, false);
            }
        });

        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' && card.location === 'play area'
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.blankExcludingTraits
                }));

                this.game.addMessage(
                    '{0} uses {1} to treat the text box of {2} as blank until the end of the phase',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }

    isControlledStarkCharacter(card) {
        return (
            card.controller === this.controller &&
            card.getType() === 'character' &&
            card.isFaction('stark')
        );
    }
}

MeeraReed.code = '11061';

export default MeeraReed;
