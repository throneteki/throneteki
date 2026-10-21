import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Ice extends DrawCard {
    // Ice (01153)
    // [stark] character only.
    // Attached character gets +2 STR.
    // Reaction: After you win a [military] challenge in which attached character is participating,
    // sacrifice Ice to choose and kill a character controlled by the losing opponent.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark' });
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'military' &&
                    event.challenge.isParticipating(this.parent)
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.event.challenge.loser &&
                    card.getType() === 'character',
                gameAction: 'kill'
            },
            message: '{player} sacrifices {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

Ice.code = '01153';

export default Ice;
