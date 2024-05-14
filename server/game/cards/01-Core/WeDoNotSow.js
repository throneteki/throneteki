const DrawCard = require('../../drawcard.js');

class WeDoNotSow extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && event.challenge.isUnopposed()
            },
            target: {
                activePromptTitle: 'Select attachment or location',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.game.currentChallenge.loser &&
                    (card.getType() === 'attachment' || card.getType() === 'location'),
                gameAction: 'discard'
            },
            handler: (context) => {
                context.target.controller.discardCard(context.target);
                this.game.addMessage(
                    '{0} plays {1} to discard {2} from play',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

WeDoNotSow.code = '01083';

module.exports = WeDoNotSow;
