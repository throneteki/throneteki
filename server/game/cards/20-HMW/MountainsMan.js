import DrawCard from '../../drawcard.js';

class MountainsMan extends DrawCard {
    // Mountain's Man (20013)
    // [lannister] character only.
    // Attached character gains the House Clegane trait.
    // Reaction: After attached character discards a card using pillage, choose and kneel a card
    // with lower printed cost than that card's.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'lannister' });
        this.whileAttached({
            effect: ability.effects.addTrait('House Clegane')
        });
        this.reaction({
            when: {
                onCardDiscarded: (event) => event.isPillage && event.source === this.parent
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getPrintedCost() < context.event.card.getPrintedCost() &&
                    !card.kneeled,
                gameAction: 'kneel'
            },
            message: '{player} uses {source} to kneel {target}',
            handler: (context) => {
                context.target.controller.kneelCard(context.target);
            }
        });
    }
}

MountainsMan.code = '20013';

export default MountainsMan;
