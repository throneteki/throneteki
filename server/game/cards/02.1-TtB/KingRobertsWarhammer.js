import DrawCard from '../../drawcard.js';

class KingRobertsWarhammer extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.isAttacking(this.parent)
            },
            target: {
                activePromptTitle: 'Select character(s)',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.kneeled,
                maxStat: () => this.parent.getStrength(),
                cardStat: (card) => card.getStrength(),
                gameAction: 'kneel'
            },
            handler: (context) => {
                for (let card of context.target) {
                    card.controller.kneelCard(card);
                }

                this.game.addMessage(
                    '{0} uses {1} to kneel {2}',
                    this.controller,
                    this,
                    context.target
                );
                // King Robert's Warhammer specifically has its sacrifice as a then-effect, not a cost
                this.controller.sacrificeCard(this);
                this.game.addMessage('{0} then sacrifices {1}', this.controller, this);
            }
        });
    }
}

KingRobertsWarhammer.code = '02008';

export default KingRobertsWarhammer;
