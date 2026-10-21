import DrawCard from '../../drawcard.js';

class MaestersChain extends DrawCard {
    // Maester's Chain (02117)
    // Maester character only.
    // Dominance Action: Kneel Maester's Chain to choose a Condition attachment, and discard it from
    // play.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Maester' });
        this.action({
            title: 'Discard condition attachment',
            phase: 'dominance',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'attachment' &&
                    card.hasTrait('condition')
            },
            handler: (context) => {
                context.target.owner.discardCard(context.target);
                this.game.addMessage(
                    '{0} kneels {1} to discard {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

MaestersChain.code = '02117';

export default MaestersChain;
