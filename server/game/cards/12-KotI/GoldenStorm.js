import DrawCard from '../../drawcard.js';

class GoldenStorm extends DrawCard {
    // Golden Storm (12018)
    // Reaction: After you win a [military] challenge as the attacking player, kneel Golden Storm to
    // choose and kill a participating character. Then, if you control a participating Raider
    // character, stand Golden Storm.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'military' &&
                    event.challenge.attackingPlayer === this.controller
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isParticipating(),
                gameAction: 'kill'
            },
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                var wasStand = false;
                context.target.owner.killCharacter(context.target);
                let cards = this.controller.filterCardsInPlay(
                    (card) =>
                        card.hasTrait('Raider') &&
                        card.getType() === 'character' &&
                        card.isParticipating() &&
                        card.controller === this.controller &&
                        card.location === 'play area'
                );
                if (cards.length > 0) {
                    if (this.allowGameAction('stand')) {
                        this.controller.standCard(this);
                        wasStand = true;
                    }
                }
                if (wasStand === true) {
                    this.game.addMessage(
                        '{0} uses {1} to kill {2} and stand {3}',
                        this.controller,
                        this,
                        context.target,
                        this
                    );
                    return;
                }

                this.game.addMessage(
                    '{0} uses {1} to kill {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

GoldenStorm.code = '12018';

export default GoldenStorm;
