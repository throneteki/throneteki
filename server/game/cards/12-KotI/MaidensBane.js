import DrawCard from '../../drawcard.js';

class MaidensBane extends DrawCard {
    // Maiden's Bane (12019)
    // Reaction: After you win an unopposed challenge, kneel Maiden's Bane to choose and stand an
    // attacking character. Then, if that character is a Captain, stand Maiden's Bane.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({ winner: this.controller, unopposed: true })
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isAttacking() &&
                    card.kneeled,
                gameAction: 'stand'
            },
            message: '{player} kneels {source} to stand {target}',
            handler: (context) => {
                context.player.standCard(context.target);

                if (context.target.hasTrait('Captain')) {
                    this.game.addMessage('Then {0} stands {1}', context.player, this);
                    context.player.standCard(this);
                }
            }
        });
    }
}

MaidensBane.code = '12019';

export default MaidensBane;
