import DrawCard from '../../drawcard.js';

class GrowingStrong extends DrawCard {
    // Growing Strong (01195)
    // Challenges Action: Choose up to three [tyrell] characters. Until the end of the phase, each
    // of the chosen characters gets +2 STR.
    setupCardAbilities() {
        this.action({
            title: 'Give +2 STR to up to 3 characters',
            phase: 'challenge',
            target: {
                numCards: 3,
                activePromptTitle: 'Select up to three characters',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.isFaction('tyrell') &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                for (let card of context.target) {
                    card.untilEndOfPhase((ability) => ({
                        match: card,
                        effect: ability.effects.modifyStrength(2)
                    }));
                }
                this.game.addMessage(
                    '{0} plays {1} to give +2 STR to {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

GrowingStrong.code = '01195';

export default GrowingStrong;
